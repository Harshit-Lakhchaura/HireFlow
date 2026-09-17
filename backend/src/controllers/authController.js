const { body } = require("express-validator");
const { asyncHandler, ApiError } = require("../utils/errors");
const { signToken } = require("../utils/jwt");
const { validate } = require("../middleware/validate");
const User = require("../models/User");

const registerRules = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("role").optional().isIn(["seeker", "recruiter"]).withMessage("Role must be seeker or recruiter"),
];

const loginRules = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const register = [
  ...registerRules,
  validate,
  asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) throw new ApiError(409, "Email already registered");

    const user = await User.create({
      name,
      email,
      password,
      role: role === "recruiter" ? "recruiter" : "seeker",
    });
    const token = signToken(user);
    res.status(201).json({
      token,
      user: publicUser(user),
    });
  }),
];

const login = [
  ...loginRules,
  validate,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      throw new ApiError(401, "Invalid email or password");
    }
    if (!user.isActive) throw new ApiError(403, "Account is disabled");
    res.json({ token: signToken(user), user: publicUser(user) });
  }),
];

const me = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ["name", "headline", "bio", "skills", "location", "phone"];
  allowed.forEach((key) => {
    if (req.body[key] !== undefined) req.user[key] = req.body[key];
  });
  await req.user.save();
  res.json({ user: publicUser(req.user) });
});

const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "Resume file is required");
  req.user.resumeUrl = `/uploads/${req.file.filename}`;
  await req.user.save();
  res.json({ user: publicUser(req.user) });
});

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    headline: user.headline,
    bio: user.bio,
    skills: user.skills,
    location: user.location,
    phone: user.phone,
    resumeUrl: user.resumeUrl,
    createdAt: user.createdAt,
  };
}

module.exports = { register, login, me, updateProfile, uploadResume };
