import { runTestCases, executeCode, getLanguageId } from './codeEditor.service.js';
import { analyseError, classifyErrorType } from '../../services/aiErrorAgent.js';
import { clearCache, getCacheStats } from '../../services/errorCache.js';
import { awardReward } from '../rewards/reward.service.js';
import { markQuestionSolved, incrementAttempt } from '../progress/progress.service.js';

// Run test cases for a submission WITH REWARD SYSTEM
export const executeTestCases = async (req, res) => {
  try {
    const {
      sourceCode,
      language,
      testCases,
      previousErrors = [],
      problemId,
      difficulty,
      sourceArea = 'learn_page',
      mode = 'challenge',  //  Support run/challenge modes
      paramOrder = []      // Parameter mapping for flexible arg order
    } = req.body;
    const userId = req.user?._id || req.userId;

    console.log('🎯 executeTestCases called with:');
    console.log('  userId:', userId);
    console.log('  problemId:', problemId);
    console.log('  difficulty:', difficulty);
    console.log('  sourceArea:', sourceArea);
    console.log('  mode:', mode);
    console.log('  paramOrder:', paramOrder);

    // Validation
    if (!sourceCode) {
      return res.status(400).json({
        success: false,
        message: 'Source code is required'
      });
    }

    if (!language) {
      return res.status(400).json({
        success: false,
        message: 'Language is required'
      });
    }

    if (!Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Test cases array is required and cannot be empty'
      });
    }

    // Execute test cases with mode and paramOrder options
    const results = await runTestCases(sourceCode, language, testCases, {
      mode,
      paramOrder
    });

    // Attach error type label to failed results
    results.forEach(r => {
      if (r.status === 'failed') {
        r.errorType = classifyErrorType(r);
      }
    });

    // AI Error Analysis only for first failed test
    const firstFailedIndex = results.findIndex(r => r.status === 'failed');
    if (firstFailedIndex !== -1) {
      results[firstFailedIndex].aiAnalysis = await analyseError({
        userId,
        sessionId: req.sessionID,
        code: sourceCode,
        language,
        testResult: results[firstFailedIndex],
        previousErrors,
      });
    }

    const passedCount = results.filter(r => r.status === 'passed').length;
    const failedCount = results.filter(r => r.status === 'failed').length;
    const allTestsPassed = failedCount === 0 && passedCount > 0;

    // REWARD SYSTEM: Track attempt and award rewards if all tests pass
    let rewardResult = null;
    if (userId && problemId) {
      try {
        console.log('💰 Reward system: Processing for user:', userId, 'question:', problemId);
        
        // Increment attempt count
        await incrementAttempt(userId, problemId, 'coding');
        console.log('✅ Attempt incremented');

        // If all tests passed, mark solved and potentially award reward
        if (allTestsPassed) {
          await markQuestionSolved(
            userId,
            problemId,
            'coding',
            sourceArea,
            passedCount,
            testCases.length
          );
          console.log('✅ Question marked as solved');

          // Award reward
          rewardResult = await awardReward(
            userId,
            problemId,
            'coding',
            difficulty || 'Medium',
            sourceArea
          );
          console.log('✅ Reward awarded:', rewardResult);
        } else {
          console.log('⚠️ Test cases did not all pass, no reward given');
        }
      } catch (rewardError) {
        console.error('❌ Error in reward system:', rewardError);
        // Don't fail the submission if reward system has issues
      }
    } else {
      console.log('⚠️ Reward system: Skipped because userId=' + userId + ' or problemId=' + problemId);
    }

    const response = {
      success: true,
      data: {
        results,
        summary: {
          total: results.length,
          passed: passedCount,
          failed: failedCount,
          allPassed: allTestsPassed,
        }
      }
    };

    // Include reward info if applicable
    if (rewardResult) {
      response.data.reward = {
        xpAwarded: rewardResult.xpAwarded,
        tokensAwarded: rewardResult.tokensAwarded,
        alreadyRewarded: rewardResult.alreadyRewarded,
        isFirstSolve: rewardResult.isFirstSolve,
        badgesUnlocked: rewardResult.badgesUnlocked || [] // Include newly unlocked badges
      };
      response.data.updatedUserStats = rewardResult.updatedUserStats;
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error('Execute Test Cases Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to execute test cases'
    });
  }
};

// Execute code with a single input (debugging/console mode)
export const runCode = async (req, res) => {
  try {
    const { sourceCode, language, input } = req.body;

    // Validation
    if (!sourceCode) {
      return res.status(400).json({
        success: false,
        message: 'Source code is required'
      });
    }

    if (!language) {
      return res.status(400).json({
        success: false,
        message: 'Language is required'
      });
    }

    // Execute code
    const result = await executeCode(sourceCode, language, input || '');

    return res.status(200).json({
      success: result.success,
      data: result
    });
  } catch (error) {
    console.error('Run Code Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to execute code'
    });
  }
};

// Get supported languages
export const getSupportedLanguages = async (req, res) => {
  try {
    const languages = {
      python: { id: 71, name: 'Python 3' },
      javascript: { id: 63, name: 'JavaScript (Node.js)' },
      cpp: { id: 54, name: 'C++' },
      java: { id: 62, name: 'Java' },
      c: { id: 50, name: 'C' }
    };

    return res.status(200).json({
      success: true,
      data: languages
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Clear AI error cache (for testing/debugging)
export const clearAICache = async (req, res) => {
  try {
    const statsBefore = getCacheStats();
    clearCache();
    const statsAfter = getCacheStats();
    
    return res.status(200).json({
      success: true,
      message: 'AI error cache cleared',
      before: statsBefore,
      after: statsAfter
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
