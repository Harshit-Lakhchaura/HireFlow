const express = require("express");
const { protect, allow } = require("../middleware/auth");
const c = require("../controllers/companyController");

const router = express.Router();

router.get("/me", protect, allow("recruiter", "admin"), c.getMine);
router.put("/me", protect, allow("recruiter"), c.upsert);
router.get("/:id", c.getById);

module.exports = router;
