const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  createHabit,
  getHabits,
  completeHabit,
} = require("../controllers/habitController");

router.post("/", protect, createHabit);              // create habit
router.get("/", protect, getHabits);                 // get all habits
router.post("/:id/complete",protect, completeHabit); // mark habit completed
router.get("/my-habits", protect, getHabits);


module.exports = router;
