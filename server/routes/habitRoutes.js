const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");


const {
  createHabit,
  getHabits,
  completeHabit,
  updateHabitName,   
  resetHabits 
} = require("../controllers/habitController");

router.post("/", protect, createHabit);              // create habit
router.get("/", protect, getHabits); 
router.get("/my-habits", protect, getHabits);
router.put("/:id", protect, updateHabitName); 
router.post("/:id/complete",protect, completeHabit); // mark habit completed
router.post("/reset/all", protect, resetHabits);  

module.exports = router;
