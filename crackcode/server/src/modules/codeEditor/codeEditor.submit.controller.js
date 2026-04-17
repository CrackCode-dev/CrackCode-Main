import { submitSolutionService } from "./codeEditor.submit.service.js";

// Submit solution for official evaluation
// Returns: success/failure, rewards if firstiime completion, unlocked badges
export const submitSolution = async (req, res) => {
  try {
    const userId = req.user?._id || req.userId;
    const { questionId, code, languageId, sourceArea, testCases, collectionName } = req.body;

    // Validate inputs
    if (!questionId) {
      return res.status(400).json({
        success: false,
        message: "questionId is required"
      });
    }

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Code is required"
      });
    }

    if (!languageId) {
      return res.status(400).json({
        success: false,
        message: "languageId is required"
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    console.log(`📤 Submit called - userId: ${userId}, questionId: ${questionId}, sourceArea: ${sourceArea}, collectionName: ${collectionName}, testCasesProvided: ${testCases?.length || 0}`);

    // Call submit service
    const result = await submitSolutionService({
      userId,
      questionId,
      code,
      languageId,
      sourceArea: sourceArea || 'learn_page',
      collectionName: collectionName || null,
      preloadedTestCases: testCases || []
    });

    // Return response to frontend
    return res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error(`❌ Submit solution error:`, error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to submit solution"
    });
  }
};
