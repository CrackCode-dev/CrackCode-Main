import Progress from "./progress.model.js";

export const getProgress = async (req, res) => {

  try {

    const progress = await Progress.findOne({ userId: req.user.id });

    res.json(progress);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};
