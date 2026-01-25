import userModel from "../models/userModel.js";

export const getUserDate = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId); //use userId here
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
