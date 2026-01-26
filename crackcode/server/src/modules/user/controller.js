import User from "../auth/User.model.js";

export const getUserData = async (req, res) => {
  try {
    if (req.user) {
      return res.json({
        success: true,
        data: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          username: req.user.username,
          isAccountVerified: req.user.isAccountVerified,
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
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
