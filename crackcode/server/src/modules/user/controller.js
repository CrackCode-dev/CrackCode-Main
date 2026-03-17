import User from "../auth/User.model.js";
import Submission from "../learn/Submission.model.js";
import UserProgress from "../learn/UserProgress.model.js";

export const getUserData = async (req, res) => {
  try {
    if (req.user) {
      return res.json({
        success: true,
        data: {
          // Basic Info
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          username: req.user.username,
          avatar: req.user.avatar,
          isAccountVerified: req.user.isAccountVerified,
          
          // Game Stats
          level: req.user.level || 0,
          xp: req.user.xp || 0,
          xpMax: 5000, // XP needed for next level
          tokens: req.user.tokens || 0,
          tokensMax: 2000, // Max tokens cap
          rank: req.user.rank || "Rookie",
          rankMax: 100,
          casesSolved: req.user.casesSolved || 0,
          currentStreak: req.user.currentStreak || 0,
          totalXP: req.user.totalXP || 0,
          achievements: Array.isArray(req.user.achievements) ? req.user.achievements : [],
        },
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      data: {
        // Basic Info
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        isAccountVerified: user.isAccountVerified,
        
        // Game Stats
        level: user.level || 0,
        xp: user.xp || 0,
        xpMax: 5000, // XP needed for next level
        tokens: user.tokens || 0,
        tokensMax: 2000, // Max tokens cap
        rank: user.rank || "Rookie",
        rankMax: 100,
        casesSolved: user.casesSolved || 0,
        currentStreak: user.currentStreak || 0,
        totalXP: user.totalXP || 0,
        achievements: Array.isArray(user.achievements) ? user.achievements : [],
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProgressSummary = async (req, res) => {
  try {
    // If auth middleware populated req.user, use it; otherwise fetch by req.userId
    const user = req.user ? req.user : await User.findById(req.userId).select('casesSolved currentStreak achievements');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    return res.json({
      success: true,
      data: {
        casesSolved: user.casesSolved || 0,
        currentStreak: user.currentStreak || 0,
        badgesEarned: Array.isArray(user.achievements) ? user.achievements.length : 0,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Return a date-keyed activity map for the user (uses Submissions + completed progress)
export const getUserActivity = async (req, res) => {
  try {
    const userId = req.userId;

    // Support either a days window (days) OR explicit startDate/endDate (ISO strings)
    const days = req.query.days ? parseInt(req.query.days, 10) : null;
    const startDateQuery = req.query.startDate;
    const endDateQuery = req.query.endDate;

    let start;
    let end = new Date();

    if (startDateQuery) {
      start = new Date(startDateQuery);
      if (endDateQuery) end = new Date(endDateQuery);
      // normalize times
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else if (days) {
      start = new Date();
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - (days - 1));
    } else {
      // default to last 84 days
      start = new Date();
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - 83);
    }

    // Gather submissions within range
    const submissions = await Submission.find({ userId, createdAt: { $gte: start, $lte: end } }).select('createdAt');

    // Gather completed progress entries within range
    const completed = await UserProgress.find({ userId, completedAt: { $gte: start, $lte: end } }).select('completedAt');

    const activity = {};

    const addDate = (d) => {
      const dateStr = d.toISOString().split('T')[0];
      activity[dateStr] = (activity[dateStr] || 0) + 1;
    };

    submissions.forEach((s) => addDate(s.createdAt));
    completed.forEach((c) => addDate(c.completedAt));

    return res.json({ success: true, data: { startDate: start.toISOString().split('T')[0], endDate: end.toISOString().split('T')[0], activity } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
