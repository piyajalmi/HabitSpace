const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { signup, login, verifyEmail, getMe } = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify-email/:token", verifyEmail);
router.get("/me", protect, getMe);





module.exports = router;
