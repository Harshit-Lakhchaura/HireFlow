const express = require("express");
const { protect, allow } = require("../middleware/auth");
const { optionalAuth } = require("../middleware/optionalAuth");
const j = require("../controllers/jobController");

const router = express.Router();

router.get("/", j.listJobs);
router.get("/mine/posted", protect, allow("recruiter", "admin"), j.myJobs);
router.get("/saved/me", protect, allow("seeker"), j.savedJobs);
router.get("/:id", optionalAuth, j.getJob);
router.post("/", protect, allow("recruiter"), j.createJob);
router.put("/:id", protect, allow("recruiter", "admin"), j.updateJob);
router.delete("/:id", protect, allow("recruiter", "admin"), j.deleteJob);
router.post("/:id/save", protect, allow("seeker"), j.toggleSave);

module.exports = router;
