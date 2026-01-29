const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");

const {
  createHabit,
  getHabits,
  completeHabit,
} = require("../controllers/habitController");

router.post("/", protect, createHabit); // create habit
router.get("/", protect, getHabits); // get all habits
router.post("/:id/complete", protect, completeHabit); // mark habit completed
router.get("/my-habits", protect, getHabits);

//below this added by laxmi
router.post("/reset", authMiddleware, async (req, res) => {
  try {
    await Habit.updateMany(
      { userId: req.user.id },
      {
        $set: {
          currentState: "neutral",
          consecutiveDays: 0,
          lastCompletedDate: null,
        },
      },
    );

    res.json({ message: "Habits reset successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to reset habits" });
  }
});

//above this added by laxmi

module.exports = router;
