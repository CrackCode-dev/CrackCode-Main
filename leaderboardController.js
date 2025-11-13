const Leaderboard = require('./leaderboardModel');

exports.getLeaderboard = async (req, res) => {
  try {
    const leaders = await Leaderboard.find().sort({ xp: -1 });
    res.json(leaders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard', error });
  }
};
