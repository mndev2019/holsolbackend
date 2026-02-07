// const jwt = require("jsonwebtoken");
// const WebUser = require("../models/WebUser");

// exports.isWebUser = async (req, res, next) => {
//     try {
//         const token = req.headers.authorization?.split(" ")[1];
//         if (!token) {
//             return res.status(401).json({ message: "Login required" });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         const user = await WebUser.findById(decoded.id).select("-password");
//         if (!user) {
//             return res.status(401).json({ message: "Invalid token" });
//         }

//         req.webUser = user;
//         next();
//     } catch (error) {
//         res.status(401).json({ message: "Unauthorized" });
//     }
// };

const jwt = require("jsonwebtoken");
const WebUser = require("../models/WebUser");

exports.isWebUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔥 IMPORTANT PART
    const user = await WebUser.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.webUser = user; // ✅ THIS WAS MISSING
    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
