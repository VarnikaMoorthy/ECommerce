const jwt = require("jsonwebtoken");
require("dotenv").config();

// Role mapping: Convert role names to role IDs
const roleMap = {
  "admin": 1,
  "staff": 2,
  "vendor": 3,
  "user": 4
};

/**
 * ✅ Middleware to authenticate users via JWT
 */
const authenticate = (req, res, next) => {
  const token = req.header("Authorization");

  // ✅ Allow public access for GET requests (search & pagination)
  if (!token) {
    if (req.method === "GET") return next();
    return res.status(401).json({ error: "Access Denied" });
  }

  const tokenParts = token.split(" ");
  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(400).json({ error: "Invalid Authorization Header" });
  }

  try {
    console.log("🔑 JWT Secret Used for Verification:", process.env.JWT_SECRET);
    const verified = jwt.verify(tokenParts[1], process.env.JWT_SECRET);
    req.user = verified;
    console.log("✅ Authenticated User:", req.user);
    next();
  } catch (err) {
    console.log("🚨 JWT Verification Failed:", err.message);
    res.status(400).json({ error: "Invalid Token" });
  }
};

/**
 * ✅ Middleware to check role-based authorization
 * @param {Array} roles - Allowed roles (e.g., ['admin', 'vendor'])
 */
const authorize = (roles) => (req, res, next) => {
  const userRoleId = Number(req.user.role); // ✅ Ensure it's a number

  console.log("🔍 Required Roles:", roles);
  console.log("🔍 User Role in Token:", userRoleId);

  // Convert role names (e.g., "admin") to role IDs (e.g., 1)
  const allowedRoles = roles.map(role => roleMap[role] ?? role);

  console.log("✅ Allowed Role IDs:", allowedRoles);

  if (!allowedRoles.includes(userRoleId)) {
    console.log("🚨 Permission Denied");
    return res.status(403).json({ error: "Permission Denied" });
  }

  console.log("✅ Permission Granted");
  next();
};

module.exports = { authenticate, authorize };
