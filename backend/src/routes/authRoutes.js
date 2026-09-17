const express = require("express");
const rateLimit = require("express-rate-limit");
const { protect, allow } = require("../middleware/auth");
const { upload } = require("../middleware/upload");
const auth = require("../controllers/authController");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: { message: "Too many auth attempts, try again later" },
});

router.post("/register", authLimiter, auth.register);
router.post("/login", authLimiter, auth.login);
router.get("/me", protect, auth.me);
router.put("/profile", protect, auth.updateProfile);
router.post("/resume", protect, allow("seeker"), upload.single("resume"), auth.uploadResume);

module.exports = router;
