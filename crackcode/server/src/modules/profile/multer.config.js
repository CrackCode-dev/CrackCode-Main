import multer from "multer";
import path from "path";
import fs from "fs";

// ═════════════════════════════════════════════════════════════
// Ensure uploads directory exists
// ═════════════════════════════════════════════════════════════
const uploadsDir = "uploads/avatars";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("✅ Created uploads/avatars directory");
}

// ═════════════════════════════════════════════════════════════
// Storage configuration
// ═════════════════════════════════════════════════════════════
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/avatars");
  },
  filename: (req, file, cb) => {
    // FIXED: Use req.userId (from session middleware) instead of req.user.id
    const userId = req.userId || req.user?._id || "unknown";
    const ext = path.extname(file.originalname);
    const filename = `${userId}-${Date.now()}${ext}`;
    cb(null, filename);
  }
});

// ═════════════════════════════════════════════════════════════
// File filter (only images allowed)
// ═════════════════════════════════════════════════════════════
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WebP image files are allowed"), false);
  }
};

// ═════════════════════════════════════════════════════════════
// Multer upload configuration
// ═════════════════════════════════════════════════════════════
const uploadAvatar = multer({
  storage,
  limits: { 
    fileSize: 2 * 1024 * 1024, // 2MB max file size
  },
  fileFilter
});

export default uploadAvatar;