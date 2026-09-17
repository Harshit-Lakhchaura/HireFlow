const express = require("express");
const { protect, allow } = require("../middleware/auth");
const { upload } = require("../middleware/upload");
const a = require("../controllers/applicationController");

const router = express.Router();

router.post("/", protect, allow("seeker"), upload.single("resume"), a.apply);
router.get("/me", protect, allow("seeker"), a.myApplications);
router.get("/job/:jobId", protect, allow("recruiter", "admin"), a.jobApplications);
router.patch("/:id/status", protect, allow("recruiter", "admin"), a.updateStatus);

module.exports = router;
