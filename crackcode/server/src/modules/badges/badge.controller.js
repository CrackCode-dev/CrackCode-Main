
import {
  getUserBadgeProgress,
  getUserBadgeStats,
  checkAllBadgesForUser
} from "./badge.service.js";

/*
  GET /api/badges/my-progress
  Get current user's badge progress
 */
export const getMyBadgeProgress = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const badges = await getUserBadgeProgress(userId);

    res.json({
      success: true,
      data: badges
    });
  } catch (error) {
    console.error("Badge progress error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
  GET /api/badges/stats
 Get user's badge statistics
 */
export const getBadgeStats = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const stats = await getUserBadgeStats(userId);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error("Badge stats error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/*
  POST /api/badges/check-all
  Force check all badges for current user (manual trigger)
 */
export const checkAllBadges = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const newlyUnlocked = await checkAllBadgesForUser(userId);
    const stats = await getUserBadgeStats(userId);

    res.json({
      success: true,
      message: `Checked all badges. ${newlyUnlocked.length} newly unlocked.`,
      data: {
        newlyUnlocked,
        stats
      }
    });
  } catch (error) {
    console.error("Badge check error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  getMyBadgeProgress,
  getBadgeStats,
  checkAllBadges
};
