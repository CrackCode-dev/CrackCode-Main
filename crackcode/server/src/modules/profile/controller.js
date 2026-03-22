import User from "../auth/User.model.js";
import Inventory from "../shop/Inventory.model.js";
import ShopItem from "../shop/ShopItem.model.js";
import bcrypt from "bcryptjs";


// Get logged-in user profile
export const getUserProfile = async (req, res) => {
  try {
    // req.userId comes from session middleware (userAuth)
    // Populate equipped items so frontend can read imageUrl and metadata
    const user = await User.findById(req.userId)
      .select("-password")
      .populate("equippedAvatarItemId equippedThemeItemId equippedTitleItemId");

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
        avatarType: user.avatarType,
        bio: user.bio,
        xp: user.xp,
        totalXP: user.totalXP,
        tokens: user.tokens,
        rank: user.rank,
        isAccountVerified: user.isAccountVerified,
        emailSettings: user.emailSettings,
        lastActive: user.lastActive,
        createdAt: user.createdAt,
        // include equipped item objects if populated
        equippedAvatarItemId: user.equippedAvatarItemId || null,
        equippedThemeItemId: user.equippedThemeItemId || null,
        equippedTitleItemId: user.equippedTitleItemId || null,
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


// Update profile (name, bio, preset avatar)
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

// Upload custom avatar (file upload)
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


// Edit email (simple update - use with caution)
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

// Change email (with validation)

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


// Configure email notification settings
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

// Get profile settings for account settings page
export const getProfileSettings = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select(
      "name email emailSettings isAccountVerified username profileVisibility"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("getProfileSettings error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Update email (with password verification)
export const updateEmail = async (req, res) => {
  try {
    const userId = req.userId;
    const { newEmail, password } = req.body;

    // Validation
    if (!newEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "New email and password are required"
      });
    }

    const normalizedEmail = newEmail.trim().toLowerCase();

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password"
      });
    }

    // Check if new email is same as current
    if (user.email === normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "New email cannot be same as current email"
      });
    }

    // Check if new email is already in use
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email is already in use"
      });
    }

    // Update email
    user.email = normalizedEmail;
    // Optional: set isAccountVerified to false to require re-verification
    // user.isAccountVerified = false;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email updated successfully",
      data: {
        email: user.email,
        isAccountVerified: user.isAccountVerified
      }
    });
  } catch (error) {
    console.error("updateEmail error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Update password (with current password verification)
export const updatePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All password fields are required"
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New passwords do not match"
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters"
      });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Check if new password is same as current
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password"
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (error) {
    console.error("updatePassword error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Update notification settings
export const updateNotificationSettings = async (req, res) => {
  try {
    const userId = req.userId;
    const {
      notifications,
      securityAlerts,
      weeklyDigest,
      leaderboardUpdates
    } = req.body;

    const user = await User.findById(userId).select("emailSettings");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update only provided settings
    if (typeof notifications === "boolean") {
      user.emailSettings.notifications = notifications;
    }

    if (typeof securityAlerts === "boolean") {
      user.emailSettings.securityAlerts = securityAlerts;
    }

    if (typeof weeklyDigest === "boolean") {
      user.emailSettings.weeklyDigest = weeklyDigest;
    }

    if (typeof leaderboardUpdates === "boolean") {
      user.emailSettings.leaderboardUpdates = leaderboardUpdates;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Notification settings updated successfully",
      data: user.emailSettings
    });
  } catch (error) {
    console.error("updateNotificationSettings error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// Equipping avatar as profile picture store --> my inventory

// import Inventory from "../shop/Inventory.model.js";

// export const equipItem = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { itemId, category } = req.body;

//     if (!itemId || !category) {
//       return res.status(400).json({
//         success: false,
//         message: "itemId and category are required",
//       });
//     }

//     // check ownership
//     const owned = await Inventory.findOne({
//       userId,
//       itemId,
//     });

//     if (!owned) {
//       return res.status(403).json({
//         success: false,
//         message: "Item not owned",
//       });
//     }

//     const update = {};

//     if (category === "avatar") {
//       update.equippedAvatarItemId = itemId;
//     }

//     if (category === "theme") {
//       update.equippedThemeItemId = itemId;
//     }

//     if (category === "title") {
//       update.equippedTitleItemId = itemId;
//     }

//     await User.findByIdAndUpdate(userId, update);

//     res.json({
//       success: true,
//       message: "Item equipped",
//     });
//   } catch (error) {
//     console.error("Equip item error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to equip item",
//     });
//   }
// };




export const equipItem = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId, category } = req.body;

    if (!itemId || !category) {
      return res.status(400).json({
        success: false,
        message: "itemId and category are required",
      });
    }

    const owned = await Inventory.findOne({
      userId,
      itemId,
    });

    if (!owned) {
      return res.status(403).json({
        success: false,
        message: "Item not owned",
      });
    }

    const update = {};

    if (category === "avatar") {
      update.equippedAvatarItemId = itemId;
      try {
        const shopItem = await ShopItem.findById(itemId).select("imageUrl");
        if (shopItem && shopItem.imageUrl) {
          // copy equipped avatar image into user's avatar so existing UI using `user.avatar` updates
          update.avatar = shopItem.imageUrl;
          // avatarType should reflect a preset/shop avatar
          update.avatarType = "default";
        }
      } catch (err) {
        console.warn("Could not load ShopItem to copy avatar image:", err?.message || err);
      }
    }

    if (category === "theme") {
      update.equippedThemeItemId = itemId;
    }

    if (category === "title") {
      update.equippedTitleItemId = itemId;
    }

    await User.findByIdAndUpdate(userId, update);

    res.json({
      success: true,
      message: "Item equipped",
    });

  } catch (error) {
    console.error("Equip item error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to equip item",
    });
  }
};