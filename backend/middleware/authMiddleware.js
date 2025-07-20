const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Debug: Log the decoded token structure
      console.log("Decoded token:", decoded);

      // Try different possible structures for the user ID
      let userId;
      if (decoded.user && decoded.user.id) {
        userId = decoded.user.id;
      } else if (decoded.userId) {
        userId = decoded.userId;
      } else if (decoded.id) {
        userId = decoded.id;
      } else if (decoded.user) {
        userId = decoded.user;
      } else {
        console.error("No user ID found in token:", decoded);
        return res.status(401).json({ message: "Invalid token structure" });
      }

      // Find user by ID
      req.user = await User.findById(userId).select("-password");

      // Check if user exists
      if (!req.user) {
        console.error("User not found with ID:", userId);
        return res.status(401).json({ message: "User not found" });
      }

      console.log("Authenticated user:", req.user._id);
      next();
    } catch (err) {
      console.error("Token verification failed:", err.message);

      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      } else if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired" });
      } else {
        return res
          .status(401)
          .json({ message: "Not authorized, token failed" });
      }
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

// Middleware to check if user is admin
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

module.exports = { protect, admin };
