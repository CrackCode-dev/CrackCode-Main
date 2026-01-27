import User from "../auth/User.model.js";

// Get logged-in user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update profile (text / preset avatar)
export const updateUserProfile = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name ?? user.name;
    user.bio = bio ?? user.bio;

    if (avatar) {
      user.avatar = avatar;
    }

    await user.save();

    return res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Upload avatar (multer)
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No avatar uploaded" });
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.avatar = avatarUrl;
    await user.save();

    return res.status(200).json({ message: "Avatar uploaded successfully", avatar: avatarUrl });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Edit email
export const editEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.email = email;
    await user.save();

    return res.status(200).json({ message: "Email updated successfully", email: user.email });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Change email
export const changeEmail = async (req, res) => {
  try {
    const { newEmail } = req.body;

    if (!newEmail) {
      return res.status(400).json({ message: "New email is required" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return res.status(400).json({ message: "Email already in use" });
    }

    user.email = newEmail;
    await user.save();

    return res.status(200).json({ message: "Email changed successfully", email: user.email });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Configure email settings
export const configureEmailSettings = async (req, res) => {
  try {
    const { notifications, securityAlerts } = req.body;

    const user = await User.findById(req.userId);
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

    return res.status(200).json({ message: "Email settings updated", emailSettings: user.emailSettings });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
