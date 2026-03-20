import User from "../auth/User.model.js";
import Question from "../learn/Question.model.js";
import mongoose from "mongoose";
import { runTestCases } from "./codeEditor.service.js";
import { checkAndUnlockMultipleBadges } from "../badges/badge.service.js";
import { getRewardConfig } from "../rewards/reward.config.js";
import { markQuestionSolved, incrementAttempt } from "../progress/progress.service.js";

// Helper: Convert Judge0 language ID back to language name
const getLanguageFromId = (languageId) => {
  const idMap = {
    50: "c",
    54: "cpp",
    62: "java",
    63: "javascript",
    71: "python"
  };
  return idMap[languageId] || "python";
};

// Helper: Search for question in learn collections (by problemId pattern)
// Pattern: {lang}_{difficulty}_{number} e.g., py_fundamentals_001
const findQuestionInLearnCollections = async (problemId) => {
  try {
    const langMap = { py: "Python", js: "Javascript", java: "Java", cpp: "Cpp" };
    const diffMap = { 
      fundamentals: "Fundamentals", 
      easy: "Easy", 
      intermediate: "Medium", 
      medium: "Medium",
      hard: "Hard" 
    };

    // Parse problemId: "py_fundamentals_001" → {lang: "Python", diff: "Fundamentals"}
    const parts = problemId.split('_');
    if (parts.length >= 2) {
      const langKey = parts[0].toLowerCase();
      const diffKey = parts[1].toLowerCase();

      const langValue = langMap[langKey];
      const diffValue = diffMap[diffKey];

      if (langValue && diffValue) {
        const collectionName = `learn${langValue}${diffValue}Q`;
        console.log(`   ↳ Searching in collection: "${collectionName}"`);
        
        const question = await mongoose.connection.db
          .collection(collectionName)
          .findOne({ problemId });
        
        if (question) {
          console.log(`   ✅ Found in learn collection: ${collectionName}`);
          return question;
        }
      }
    }
  } catch (err) {
    console.log(`   ⚠️ Learn collection search failed:`, err.message);
  }
  return null;
};

// Submit solution and award rewards only on first-time completion
export const submitSolutionService = async ({
  userId,
  questionId,
  code,
  languageId
}) => {
  try {
    // Debug: Log received identifiers
    console.log("📝 Submit received - userId:", userId, "questionId:", questionId);

    // Step 1: Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Step 2: Validate question exists  search learn collections first, then main Question collection
    console.log(`🔍 Searching for question with problemId: "${questionId}"`);
    
    // Try learn collections first (where most questions live)
    let question = await findQuestionInLearnCollections(questionId);
    
    // If not found in learn collections, try main Question collection
    if (!question) {
      console.log(`   ↳ Not found in learn collections, trying main Question collection`);
      question = await Question.findOne({ problemId: questionId });
      if (question) {
        console.log(`   ✅ Found in main Question collection`);
      }
    }
    
    // Last resort: try finding by _id (MongoDB ID)
    if (!question && questionId.match(/^[0-9a-f]{24}$/i)) {
      console.log(`   ↳ Not found by problemId, trying _id: "${questionId}"`);
      question = await Question.findById(questionId);
      if (question) {
        console.log(`   ✅ Found by MongoDB _id`);
      }
    }
    
    console.log(`✅ Question found:`, question ? `${question.problemId} (${question.original?.title})` : "NOT FOUND");
    if (!question) {
      throw new Error("Question not found");
    }

    // Step 3: Get test cases from question
    let testCases = question.test_cases || [];
    if (testCases.length === 0) {
      throw new Error("No test cases found for this question");
    }

    console.log(`📦 Raw test cases from DB:`, JSON.stringify(testCases.slice(0, 1), null, 2));

    // Normalize test cases: ensure they have the right field names
    testCases = testCases.map(tc => ({
      input: tc.input || tc.input_data || "",
      expectedOutput: tc.expected_output !== undefined ? tc.expected_output : tc.expectedOutput,
      setup: tc.setup || ""
    }));

    console.log(`✅ Transformed test cases:`, JSON.stringify(testCases.slice(0, 1), null, 2));

    // Step 4: Run the SAME visible test cases as Run button (first 3) - NOT hidden test cases
    // This ensures Submit validates against the same test cases user already tested
    const visibleTestCases = testCases.slice(0, Math.min(3, testCases.length));
    
    if (visibleTestCases.length === 0) {
      throw new Error("No valid test cases available for this question");
    }

    const languageName = getLanguageFromId(languageId);
    console.log(`🧪 Submitting to runTestCases with ${visibleTestCases.length} cases`);
    console.log(`   Language: ${languageName} (ID: ${languageId})`);
    console.log(`   Test cases:`, JSON.stringify(visibleTestCases, null, 2));
    // Record this attempt (creates progress entry if first time)
    try {
      await incrementAttempt(userId, questionId, 'coding', question.difficulty || null, languageName);
    } catch (err) {
      console.warn('Could not increment attempt in progress service:', err.message);
    }
    
    const testResults = await runTestCases(code, languageName, visibleTestCases, {
      mode: "challenge"
    });

    // Step 5: Check if all tests passed
    const passedCount = testResults.filter(r => r.status === "passed").length;
    const failedCount = testResults.filter(r => r.status === "failed").length;
    const allTestsPassed = failedCount === 0 && passedCount > 0;

    console.log(`📊 Test Results: ${passedCount} passed, ${failedCount} failed`);
    if (testResults.length > 0) {
      testResults.forEach((result, idx) => {
        console.log(`   Test ${idx + 1}: ${result.status === 'passed' ? '✅' : '❌'}`);
        if (result.status === 'failed') {
          console.log(`      Expected: ${result.expectedOutput}`);
          console.log(`      Got: ${result.actualOutput}`);
        }
      });
    }

    if (!allTestsPassed) {
      // Tests failed - return immediately without rewards
      console.log(`❌ Tests failed for user ${userId} on question ${questionId}`);
      return {
        passed: false,
        failedTests: testResults.filter(r => r.status === "failed"),
        message: `${failedCount} test case(s) failed`
      };
    }

    // Step 6: Check if already completed
    const alreadyCompleted = user.completedQuestionIds?.includes(questionId);

    if (alreadyCompleted) {
      // Already completed before - don't give rewards again
      console.log(`ℹ️ Question already completed by user ${userId}`);
      // Ensure progress record marks solved=true and has metadata
      try {
        await markQuestionSolved(userId, questionId, 'coding', 'code_editor', passedCount, visibleTestCases.length, question.difficulty || null, languageName);
      } catch (err) {
        console.warn('Could not mark question solved on alreadyCompleted path:', err.message);
      }
      return {
        passed: true,
        firstTimeCompletion: false,
        message: "Question already completed. No additional rewards granted."
      };
    }

    // Step 7: First-time completion - award rewards
    const rewardConfig = getRewardConfig("coding", question.difficulty);
    const earnedXP = rewardConfig.xp || 25;
    const earnedTokens = rewardConfig.tokens || 10;

    console.log(`✅ First-time completion! Awarding ${earnedXP} XP and ${earnedTokens} tokens`);

    // Step 8: Update user with completion record
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        // Add to completedQuestionIds for quick duplicate check
        $addToSet: { 
          completedQuestionIds: questionId,
          // Also add to solvedChallengeIds for legacy/challenge tracking
          solvedChallengeIds: questionId
        },
        // Add to completedQuestions for history
        $push: {
          completedQuestions: {
            questionId,
            completedAt: new Date(),
            language: languageId,
            xpAwarded: earnedXP,
            tokensAwarded: earnedTokens
          }
        },
        // Increment counters
        $inc: {
          casesSolved: 1,
          totalXP: earnedXP,
          tokens: earnedTokens
        }
      },
      { new: true }
    );

    // Step 9: Persist solved progress with difficulty + language
    try {
      await markQuestionSolved(userId, questionId, 'coding', 'code_editor', testCasesPassed = passedCount, testCasesTotal = visibleTestCases.length, question.difficulty || null, languageName);
    } catch (err) {
      console.warn('Could not persist progress:', err.message);
    }

    // Step 9: Check and unlock milestone badges
    const badgesToCheck = [
      "beginner",  // First completion
      "cases_5",   // 5 completions
      "cases_10",  // 10 completions
      "cases_25"   // 25 completions
    ];

    const newlyUnlockedBadges = await checkAndUnlockMultipleBadges(
      userId,
      badgesToCheck
    );

    if (newlyUnlockedBadges.length > 0) {
      console.log(`🏆 Unlocked badges: ${newlyUnlockedBadges.join(", ")}`);
    }

    // Log updated tracking arrays
    console.log(`✅ Updated user tracking:`);
    console.log(`   • completedQuestionIds: ${JSON.stringify(updatedUser.completedQuestionIds)}`);
    console.log(`   • solvedChallengeIds: ${JSON.stringify(updatedUser.solvedChallengeIds)}`);
    console.log(`   • casesSolved: ${updatedUser.casesSolved}`);
    console.log(`   • totalXP: ${updatedUser.totalXP}`);
    console.log(`   • tokens: ${updatedUser.tokens}`);

    // Step 10: Return complete response with updated data
    return {
      passed: true,
      firstTimeCompletion: true,
      earnedXP,
      earnedTokens,
      casesSolved: updatedUser.casesSolved,
      totalXP: updatedUser.totalXP,
      tokens: updatedUser.tokens,
      newlyUnlockedBadges,
      message: "Solution submitted successfully!"
    };

  } catch (error) {
    console.error(`❌ Submit solution error: ${error.message}`);
    throw error;
  }
};
