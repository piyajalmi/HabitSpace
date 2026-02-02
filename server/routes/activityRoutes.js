const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getUserActivity } = require("../controllers/activityController");

router.get("/history", protect, getUserActivity);

module.exports = router;
