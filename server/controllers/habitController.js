const Habit = require("../models/Habit");
const calculateHabitState = require("../utils/stateCalculator");
const updateDailySummary = require("../utils/updateDailySummary");

// 1️⃣ Create a habit
const createHabit = async (req, res) => {
  try {
    const { type } = req.body;

const habit = await Habit.create({
  userId: req.user.id,
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
    const habits = await Habit.find({ userId: req.user.id });
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

    const userId = req.user.id;

const totalHabits = await Habit.countDocuments({ userId });
const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const endOfToday = new Date();
endOfToday.setHours(23, 59, 59, 999);

const completedHabits = await Habit.countDocuments({
  userId,
  lastCompletedDate: {
    $gte: startOfToday,
    $lte: endOfToday,
  },
});


await updateDailySummary(userId, totalHabits, completedHabits);

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
