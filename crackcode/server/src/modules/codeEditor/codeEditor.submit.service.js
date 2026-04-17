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

// Helper: Search for question in caseLog collection
const findQuestionInCaseLog = async (problemId) => {
  try {
    console.log(`   ↳ Searching in caseLog collection for problemId: "${problemId}"`);
    
    // Search by problemId first (in case caseLog documents have this field)
    let question = await mongoose.connection.db
      .collection('caseLog')
      .findOne({ problemId });
    
    if (question) {
      console.log(`   ✅ Found in caseLog collection by problemId`);
      return question;
    }

    // Try searching by _id if it's a valid MongoDB ObjectId
    if (problemId.match(/^[0-9a-f]{24}$/i)) {
      try {
        console.log(`   ↳ CaseLog: Trying to find by _id (ObjectId): "${problemId}"`);
        const objId = new mongoose.Types.ObjectId(problemId);
        question = await mongoose.connection.db
          .collection('caseLog')
          .findOne({ _id: objId });
        
        if (question) {
          console.log(`   ✅ Found in caseLog collection by _id (ObjectId)`);
          return question;
        }
      } catch (objIdErr) {
        console.log(`   ⚠️ CaseLog ObjectId conversion failed: ${objIdErr.message}`);
      }

      // Fallback: try searching with string _id
      try {
        console.log(`   ↳ CaseLog: Trying to find by _id (string): "${problemId}"`);
        question = await mongoose.connection.db
          .collection('caseLog')
          .findOne({ _id: problemId });
        
        if (question) {
          console.log(`   ✅ Found in caseLog collection by _id (string)`);
          return question;
        }
      } catch (strIdErr) {
        console.log(`   ⚠️ CaseLog string _id search failed: ${strIdErr.message}`);
      }
    }

    console.log(`   ❌ CaseLog: Document not found with problemId: "${problemId}"`);
  } catch (err) {
    console.log(`   ⚠️ CaseLog collection search failed:`, err.message);
  }
  return null;
};

// Submit solution and award rewards only on first-time completion
export const submitSolutionService = async ({
  userId,
  questionId,
  code,
  languageId,
  sourceArea = 'learn_page',
  collectionName = null,
  preloadedTestCases = []
}) => {
  try {
    // Debug: Log received identifiers
    console.log("📝 Submit received - userId:", userId, "questionId:", questionId, "sourceArea:", sourceArea, "collectionName:", collectionName, "preloadedTestCases:", preloadedTestCases.length);

    // Step 1: Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    let testCases = [];
    let question = null;

    console.log(`📊 TEST CASES ANALYSIS:`);
    console.log(`   - preloadedTestCases.length: ${preloadedTestCases?.length || 0}`);
    console.log(`   - preloadedTestCases: ${JSON.stringify(preloadedTestCases?.slice(0, 1))}`);
    console.log(`   - collectionName provided: ${collectionName ? 'YES - ' + collectionName : 'NO'}`);
    console.log(`   - sourceArea: ${sourceArea}`);

    console.log(`🔍 Searching for question with questionId: "${questionId}"`);

    if (collectionName) {
      console.log(`   → Direct lookup in collection: "${collectionName}"`);
      console.log(`   → Searching for problemId: ${questionId}`);
      question = await mongoose.connection.db
        .collection(collectionName)
        .findOne({ problemId: questionId });

      console.log(`   → Result from problemId search: ${question ? 'FOUND' : 'NOT FOUND'}`);

      if (!question && questionId.match(/^[0-9a-f]{24}$/i)) {
        try {
          const objId = new mongoose.Types.ObjectId(questionId);
          console.log(`   → Trying ObjectId search for: ${objId}`);
          question = await mongoose.connection.db
            .collection(collectionName)
            .findOne({ _id: objId });
          console.log(`   → Result from ObjectId search: ${question ? 'FOUND' : 'NOT FOUND'}`);
        } catch (err) {
          console.log(`   → ObjectId conversion failed: ${err.message}`);
          console.log(`   → Trying string _id search for: ${questionId}`);
          question = await mongoose.connection.db
            .collection(collectionName)
            .findOne({ _id: questionId });
          console.log(`   → Result from string _id search: ${question ? 'FOUND' : 'NOT FOUND'}`);
        }
      }

      if (question) {
        console.log(`   ✅ Found in collection: ${collectionName}, has test_cases: ${question.test_cases ? question.test_cases.length : 0}`);
      } else {
        console.log(`   ❌ Not found in collection: ${collectionName}, attempting fallback...`);
      }
    } else {
      console.log(`⚠️ WARNING: collectionName is NULL! This means frontend didn't pass it.`);
    }

    if (!question && sourceArea === 'case_log') {
      console.log(`   → Fallback: Searching caseLog collection`);
      question = await findQuestionInCaseLog(questionId);
    }

    if (!question) {
      console.log(`   → Fallback: Searching learn collections`);
      question = await findQuestionInLearnCollections(questionId);
    }

    if (!question) {
      console.log(`   ↳ Fallback: Trying main Question collection`);
      question = await Question.findOne({ problemId: questionId });
      if (question) {
        console.log(`   ✅ Found in main Question collection`);
      }
    }

    if (!question && questionId.match(/^[0-9a-f]{24}$/i)) {
      console.log(`   ↳ Fallback: Trying by MongoDB _id`);
      question = await Question.findById(questionId);
      if (question) {
        console.log(`   ✅ Found by MongoDB _id`);
      }
    }

    if (preloadedTestCases && preloadedTestCases.length > 0) {
      console.log(`✅ Using preloaded test cases from frontend (${preloadedTestCases.length} cases)`);
      testCases = preloadedTestCases;
    } else {
      console.log(`⚠️ WARNING: preloadedTestCases is EMPTY or NULL. Will use question document test cases.`);
    }

    if (testCases.length === 0) {
      testCases = question?.test_cases || question?.testCases || [];
    }

    const questionDifficulty = question?.difficulty || null;
    
    console.log(`📦 Test cases found: ${testCases.length}`);
    console.log(`📦 Raw test cases from DB:`, JSON.stringify(testCases.slice(0, 1), null, 2));

    if (testCases.length === 0) {
      throw new Error("No test cases found for this question");
    }

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
      await incrementAttempt(userId, questionId, 'coding', questionDifficulty, languageName);
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
        await markQuestionSolved(userId, questionId, 'coding', 'code_editor', passedCount, visibleTestCases.length, questionDifficulty, languageName);
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
    const rewardConfig = getRewardConfig("coding", questionDifficulty);
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
      console.log(`📝 Marking question solved - difficulty: ${question.difficulty}, language: ${languageName}`);
      await markQuestionSolved(
        userId,
        questionId,
        'coding',
        'code_editor',
        passedCount,                    // testCasesPassed
        visibleTestCases.length,        // testCasesTotal
        question.difficulty || null,    // difficulty
        languageName                    // language
      );
      console.log('✅ Progress marked as solved');
    } catch (err) {
      console.error('❌ Error marking progress:', err.message);
    }

    // Step 9: Check and unlock milestone badges + language-specific badges
    const badgesToCheck = [
      "beginner",              // First completion
      "cases_5",               // 5 completions
      "cases_10",              // 10 completions
      "cases_25",              // 25 completions
      "python_complete",       // Complete 5 Python questions
      "javascript_complete",   // Complete 5 JavaScript questions
      "java_complete",         // Complete 5 Java questions
      "cpp_complete",          // Complete 5 C++ questions
      "career_map_complete"    // Complete 5 questions in all 4 languages
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
