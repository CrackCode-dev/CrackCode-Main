import express from "express";
import userAuth from "../middleware/userAuth.js"; //  fixed path
import User from "../models/user.js"; //  fixed path

const router = express.Router();

/* Example endpoint: get user achievements */
router.get("/", userAuth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id)
      .populate("achievements.achievement");

    res.json(currentUser.achievements || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
