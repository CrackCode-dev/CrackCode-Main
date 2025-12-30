const express = require("express");
const router = express.Router();
const { getUserStatistics } = require("../controllers/statisticsController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/user", authMiddleware, getUserStatistics);

module.exports = router;
