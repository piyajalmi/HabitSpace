const Habit = require("../models/Habit");
const calculateHabitState = require("../utils/stateCalculator");

// 1️⃣ Create a habit
const createHabit = async (req, res) => {
  try {
   const { type, objectType } = req.body;

    const habit = await Habit.create({
      userId: req.user._id,
      objectType: type, // ✅ unified field
    });


    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2️⃣ Get all habits for a user
const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.user._id });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3️⃣ Mark habit as completed
const completeHabit = async (req, res) => {
  try {
    const { type } = req.params;

    const habit = await Habit.findOne({
      userId: req.user._id,
      objectType: type,
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const today = new Date();
    const last = habit.lastCompletedDate;

    const diffDays = last
      ? Math.floor((today - last) / (1000 * 60 * 60 * 24))
      : null;

    if (diffDays === 1) habit.consecutiveDays += 1;
    else if (diffDays > 1) habit.consecutiveDays = 1;
    else if (diffDays === 0) return res.json(habit);

    habit.lastCompletedDate = today;
    habit.currentState = calculateHabitState(habit); // ✅ update state

    await habit.save();
    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: "Error completing habit" });
  }
};

module.exports = {
  createHabit,
  getHabits,
  completeHabit,
};
