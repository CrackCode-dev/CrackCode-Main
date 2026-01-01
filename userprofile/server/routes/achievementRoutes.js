import express from "express";
import userAuth from "../middleware/userAuth.js";
import User from "../models/user.js";

const router = express.Router();

/*router.get("/my-achievements", protect, async (req, res) => {
  const user = await User.findById(req.user.id)
    .populate("achievements.achievement");

  res.json(user.achievements);
});*/

router.get("/", userAuth, (req, res) => {
  res.send("Achievements endpoint working!");
});


export default router;
