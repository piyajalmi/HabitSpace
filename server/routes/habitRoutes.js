const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  createHabit,
  getHabits,
  completeHabit,
} = require("../controllers/habitController");

router.post("/", createHabit);              // create habit
router.get("/", getHabits);                 // get all habits
router.post("/:id/complete", completeHabit); // mark habit completed

module.exports = router;
