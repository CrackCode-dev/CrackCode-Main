import User from "../auth/User.model.js";

/**
 * Get Top 10 Players for the Leaderboard
 */
export const getGlobalLeaderboard = async (_req, res) => {
  try {
    const topPlayers = await User.find({
      username: { $exists: true, $ne: null },
    })
      .sort({ totalXP: -1 })
      .limit(10)
      .select(
        "username totalXP rank avatar casesSolved streak specialization"
      );

    const leaderboard = topPlayers.map((player, index) => ({
      position: index + 1,
      username: player.username,
      totalXP: player.totalXP || 0,
      rank: player.rank || "Rookie",
      avatar: player.avatar,
      casesSolved: player.casesSolved || 0,
      streak: player.streak || 0,
      specialization: player.specialization || "General",
    }));

    return res.status(200).json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    console.error("Leaderboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard",
    });
  }
};

/**
 * Get logged-in user's rank
 */
export const getMyRank = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select(
      "username totalXP rank avatar casesSolved streak specialization"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const usersAhead = await User.countDocuments({
      totalXP: { $gt: user.totalXP || 0 },
      username: { $exists: true, $ne: null },
    });

    return res.status(200).json({
      success: true,
      position: usersAhead + 1,
      username: user.username,
      totalXP: user.totalXP || 0,
      rank: user.rank || "Rookie",
      avatar: user.avatar,
      casesSolved: user.casesSolved || 0,
      streak: user.streak || 0,
      specialization: user.specialization || "General",
    });
  } catch (error) {
    console.error("Error fetching user rank:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch rank",
    });
  }
};

/**
 * Paginated leaderboard
 */
export const getPaginatedLeaderboard = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [players, total] = await Promise.all([
      User.find({ username: { $exists: true, $ne: null } })
        .sort({ totalXP: -1 })
        .skip(skip)
        .limit(limit)
        .select(
          "username totalXP rank avatar casesSolved streak specialization"
        ),
      User.countDocuments({ username: { $exists: true, $ne: null } }),
    ]);

    const leaderboard = players.map((player, index) => ({
      position: skip + index + 1,
      username: player.username,
      totalXP: player.totalXP || 0,
      rank: player.rank || "Rookie",
      avatar: player.avatar,
      casesSolved: player.casesSolved || 0,
      streak: player.streak || 0,
      specialization: player.specialization || "General",
    }));

    return res.status(200).json({
      success: true,
      leaderboard,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Paginated Leaderboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard",
    });
  }
};
