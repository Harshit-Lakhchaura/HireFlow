const express = require("express");
const { protect, allow } = require("../middleware/auth");
const admin = require("../controllers/adminController");

const router = express.Router();

router.use(protect, allow("admin"));
router.get("/stats", admin.stats);
router.get("/users", admin.users);
router.patch("/users/:id/toggle", admin.toggleUser);

module.exports = router;
