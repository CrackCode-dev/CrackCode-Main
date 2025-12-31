import Case from "../models/case.js";

export const getUserStatistics = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;

    const solvedCases = await Case.find({
      userId,
      isSolved: true,
    });

    const difficultyStats = {
      Easy: 0,
      Medium: 0,
      Hard: 0,
    };

    const learningStats = {
      "Data Structures": 0,
      "Algorithms": 0,
      "Web Development": 0,
    };

    solvedCases.forEach(c => {
      if (difficultyStats[c.difficulty] !== undefined) {
        difficultyStats[c.difficulty]++;
      }
      if (learningStats[c.category] !== undefined) {
        learningStats[c.category]++;
      }
    });

    const totalSolved = solvedCases.length || 1;

    const learningPercentages = {};
    for (let key in learningStats) {
      learningPercentages[key] = Math.round(
        (learningStats[key] / totalSolved) * 100
      );
    }

    res.status(200).json({
      difficultyDistribution: difficultyStats,
      learningDistribution: learningPercentages,
    });

  } catch (error) {
    console.error("Statistics Error:", error);
    res.status(500).json({ message: "Failed to load statistics" });
  }
};
