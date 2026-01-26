import UserProgress from "./UserProgress.model.js";
import Question from "./Question.model.js";

// Get user's progress on all questions
export const getUserProgress = async (req, res) => {
  try {
    const userId = req.userId;

    const progress = await UserProgress.find({ userId }).populate("questionId");
    return res.status(200).json(progress);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update progress for a question
export const updateProgress = async (req, res) => {
  try {
    const userId = req.userId;
    const { questionId, status } = req.body;

    const progress = await UserProgress.findOneAndUpdate(
      { userId, questionId },
      {
        status,
        $inc: { attempts: 1 },
        ...(status === "completed" && { completedAt: new Date() }),
      },
      { upsert: true, new: true }
    );

    return res.status(200).json(progress);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get roadmap with progress
export const getRoadmap = async (req, res) => {
  try {
    const userId = req.userId;

    const questions = await Question.find().sort({ difficulty: 1 });
    const progress = await UserProgress.find({ userId });

    const progressMap = {};
    progress.forEach((p) => {
      progressMap[p.questionId.toString()] = p.status;
    });

    const roadmap = questions.map((q) => ({
      ...q.toObject(),
      status: progressMap[q._id.toString()] || "not_started",
    }));

    return res.status(200).json(roadmap);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
