const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function optionalAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user && user.isActive) req.user = user;
  } catch {
    /* ignore invalid token on public routes */
  }
  next();
}

module.exports = { optionalAuth };
