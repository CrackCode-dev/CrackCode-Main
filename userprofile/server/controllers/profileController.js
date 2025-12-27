import User from "../models/user.js";

/*Get Logged-in User Profile */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*Update Profile (Text / Preset Avatar)*/
export const updateUserProfile = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name ?? user.name;
    user.bio = bio ?? user.bio;

    // Only for avatar presets / URLs
    if (avatar) {
      user.avatar = avatar;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*Upload Avatar (Multer) */
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No avatar uploaded" });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.avatar = avatarUrl;
    await user.save();

    res.status(200).json({
      message: "Avatar uploaded successfully",
      avatar: avatarUrl
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Edit email
export const editEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.email = email;
    await user.save();

    res.status(200).json({
      message: "Email updated successfully",
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//change email
export const changeEmail = async (req, res) => {
  try {
    const { newEmail } = req.body;

    if (!newEmail) {
      return res.status(400).json({ message: "New email is required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Optional: check if email already exists
    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    user.email = newEmail;
    await user.save();

    res.status(200).json({
      message: "Email changed successfully",
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//configure email
export const configureEmailSettings = async (req, res) => {
  try {
    const { notifications, securityAlerts } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (typeof notifications === "boolean") {
      user.emailSettings.notifications = notifications;
    }

    if (typeof securityAlerts === "boolean") {
      user.emailSettings.securityAlerts = securityAlerts;
    }

    await user.save();

    res.status(200).json({
      message: "Email settings updated",
      emailSettings: user.emailSettings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

