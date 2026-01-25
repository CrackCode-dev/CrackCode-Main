// middleware/userAuth.js

import jwt from "jsonwebtoken";
import User from "../models/user.js";

// Middleware to protect routes
const userAuth = async (req, res, next) => {
  try {
    //Get token from Authorization header (must be in Bearer format)
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized. Token must be in 'Authorization: Bearer <token>' header, not a cookie."
      });
    }

    //Extract the token part ("Bearer <token>" -> "<token>")
    const token = authHeader.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user from the database
    req.user = await User.findById(decoded.id).select("-password"); // exclude password

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Proceed to next middleware/route
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};

export default userAuth;
