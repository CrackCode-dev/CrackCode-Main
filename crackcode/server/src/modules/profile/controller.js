import User from "../auth/User.model.js";

// ═════════════════════════════════════════════════════════════
// Get logged-in user profile
// ═════════════════════════════════════════════════════════════
export const getUserProfile = async (req, res) => {
  try {
    // req.userId comes from session middleware (userAuth)
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        xp: user.xp,
        totalXP: user.totalXP,
        tokens: user.tokens,
        rank: user.rank,
        isAccountVerified: user.isAccountVerified,
        emailSettings: user.emailSettings,
        lastActive: user.lastActive,
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ═════════════════════════════════════════════════════════════
// Update profile (name, bio, preset avatar)
// ═════════════════════════════════════════════════════════════
export const updateUserProfile = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Update only provided fields
    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    return res.status(200).json({ 
      success: true,
      message: "Profile updated successfully", 
      user: {
        id: user._id,
        name: user.name,
        bio: user.bio,
        avatar: user.avatar,
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ═════════════════════════════════════════════════════════════
// Upload custom avatar (file upload)
// ═════════════════════════════════════════════════════════════
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: "No avatar file uploaded" 
      });
    }

    // File path from multer
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    user.avatar = avatarUrl;
    await user.save();

    return res.status(200).json({ 
      success: true,
      message: "Avatar uploaded successfully", 
      avatar: avatarUrl 
    });
  } catch (error) {
    console.error("Upload avatar error:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ═════════════════════════════════════════════════════════════
// Edit email (simple update - use with caution)
// ═════════════════════════════════════════════════════════════
export const editEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: "Email is required" 
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Check if email is already taken
    const emailExists = await User.findOne({ email, _id: { $ne: req.userId } });
    if (emailExists) {
      return res.status(400).json({ 
        success: false, 
        message: "Email already in use" 
      });
    }

    user.email = email;
    user.isAccountVerified = false; // Require re-verification
    await user.save();

    return res.status(200).json({ 
      success: true,
      message: "Email updated. Please verify your new email.", 
      email: user.email 
    });
  } catch (error) {
    console.error("Edit email error:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ═════════════════════════════════════════════════════════════
// Change email (with validation)
// ═════════════════════════════════════════════════════════════
export const changeEmail = async (req, res) => {
  try {
    const { newEmail } = req.body;

    if (!newEmail) {
      return res.status(400).json({ 
        success: false, 
        message: "New email is required" 
      });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Check if email is already taken
    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return res.status(400).json({ 
        success: false, 
        message: "Email already in use" 
      });
    }

    user.email = newEmail;
    user.isAccountVerified = false; // Require re-verification
    await user.save();

    return res.status(200).json({ 
      success: true,
      message: "Email changed successfully. Please verify your new email.", 
      email: user.email 
    });
  } catch (error) {
    console.error("Change email error:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ═════════════════════════════════════════════════════════════
// Configure email notification settings
// ═════════════════════════════════════════════════════════════
export const configureEmailSettings = async (req, res) => {
  try {
    const { notifications, securityAlerts } = req.body;

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Update settings if provided
    if (typeof notifications === "boolean") {
      user.emailSettings.notifications = notifications;
    }

    if (typeof securityAlerts === "boolean") {
      user.emailSettings.securityAlerts = securityAlerts;
    }

    await user.save();

    return res.status(200).json({ 
      success: true,
      message: "Email settings updated successfully", 
      emailSettings: user.emailSettings 
    });
  } catch (error) {
    console.error("Configure email settings error:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};