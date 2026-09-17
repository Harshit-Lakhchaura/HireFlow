const { asyncHandler } = require("../utils/errors");
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Company = require("../models/Company");

const stats = asyncHandler(async (req, res) => {
  const [users, jobs, applications, companies, byRole, byStatus] = await Promise.all([
    User.countDocuments(),
    Job.countDocuments(),
    Application.countDocuments(),
    Company.countDocuments(),
    User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
    Application.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
  ]);
  res.json({ users, jobs, applications, companies, byRole, byStatus });
});

const users = asyncHandler(async (req, res) => {
  const list = await User.find().select("-password").sort({ createdAt: -1 }).limit(100);
  res.json({ users: list });
});

const toggleUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.role === "admin") return res.status(400).json({ message: "Cannot disable admin" });
  user.isActive = !user.isActive;
  await user.save();
  res.json({ user });
});

module.exports = { stats, users, toggleUser };
