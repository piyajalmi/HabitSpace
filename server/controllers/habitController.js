const Habit = require("../models/Habit");
const calculateHabitState = require("../utils/stateCalculator");

// 1️⃣ Create a habit
const createHabit = async (req, res) => {
  try {
    const { userId, type } = req.body;

    const habit = await Habit.create({
      userId,
      type,
    });

    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2️⃣ Get all habits for a user
const getHabits = async (req, res) => {
  try {
    const { userId } = req.query;

    const habits = await Habit.find({ userId });

    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3️⃣ Mark habit as completed
const completeHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If completed yesterday, increment streak
    if (habit.lastCompletedDate) {
      const lastDate = new Date(habit.lastCompletedDate);
      lastDate.setHours(0, 0, 0, 0);

      const diffDays =
        (today - lastDate) / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        habit.consecutiveDays += 1;
      } else if (diffDays > 1) {
        habit.consecutiveDays = 1;
      }
    } else {
      habit.consecutiveDays = 1;
    }

    habit.lastCompletedDate = today;

    // 🔑 Recalculate state
    habit.currentState = calculateHabitState(habit);

    await habit.save();

    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createHabit,
  getHabits,
  completeHabit,
};
