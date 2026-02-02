const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { getNotifications, markAsSeen } = require("../controllers/notificationController");

router.get("/", protect, getNotifications);
router.post("/seen", protect, markAsSeen);
module.exports = router;
