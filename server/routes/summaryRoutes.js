const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getOrCreateTodaySummary } = require("../controllers/summaryController");

router.get("/today", protect, getOrCreateTodaySummary);

module.exports = router;
