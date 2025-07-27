const jwt = require("jsonwebtoken");
const config = require("../config/config.json");
const User = require("../models/user");

const validateCookie = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    } else {
        console.log("Token from cookies:", token); // Log the token for debugging
      const decodedToken = await jwt.verify(token, config.tokenSecret);
      console.log("Decoded Token:", decodedToken); // Log the decoded token for debugging
      if (!decodedToken) {
        return res.status(401).json({ message: "Invalid token" });
      } else {
        const { _id } = decodedToken;
        console.log("Decoded User ID:", _id);
        if (!_id) {
          return res.status(401).json({ message: "Unauthorized access, invalid token" });
        }
        const userDetails = await User.findById(_id);
        if (!userDetails) {
          return res.status(401).json({ message: "User not found" });
        }
        req.user = userDetails; // Attach user details to request object
        next(); // Proceed to the next middleware or route handler
      }
    }
  } catch (err) {
    console.error("Error in cookie validation:", err);
    return res
      .status(500)
      .json({
        error: err.message || "Internal server error during cookie validation",
      });
  }
};

module.exports = { validateCookie };
