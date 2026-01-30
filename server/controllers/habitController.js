const Habit = require("../models/Habit");
const calculateHabitState = require("../utils/stateCalculator");

// 1️⃣ Create a habit
const createHabit = async (req, res) => {
  try {
   const { type } = req.body;

    const habit = await Habit.create({
      userId: req.user._id,
     type: type, // ✅ unified field
    });


    res.status(201).json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2️⃣ Get all habits for a user
const getHabits = async (req, res) => {
   try {
    const userId = req.user._id;

    let habits = await Habit.find({ userId });

    // 🟢 IF USER HAS NO HABITS → CREATE DEFAULT ONES
    if (habits.length === 0) {
      const defaultHabits = [
        { userId, type: "plant" },
        { userId, type: "lamp" },
        { userId, type: "window" },
        { userId, type: "bookshelf" },
      ];

      await Habit.insertMany(defaultHabits);

      habits = await Habit.find({ userId });
    }

    res.json(habits);
  } catch (err) {
    console.error("Error fetching habits:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 3️⃣ Mark habit as completed
const completeHabit = async (req, res) => {
  try {
    const { id } = req.params;

const habit = await Habit.findOne({
  _id: id,
  userId: req.user._id,
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
    else if (diffDays > 1 || diffDays === null) habit.consecutiveDays = 1;
    else if (diffDays === 0) return res.json(habit);

    habit.lastCompletedDate = today;
    habit.currentState = calculateHabitState(habit);

    await habit.save();
    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: "Error completing habit" });
  }
};

exports.updateHabitName = async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { habitName: req.body.habitName },
      { new: true }
    );

    if (!habit) return res.status(404).json({ message: "Habit not found" });

    res.json(habit);
  } catch (err) {
    res.status(500).json({ message: "Failed to update habit name" });
  }
};

exports.resetHabits = async (req, res) => {
  try {
    await Habit.updateMany(
      { userId: req.user._id },
      {
        currentState: "neutral",
        consecutiveDays: 0,
        lastCompletedDate: null,
      }
    );

    res.json({ message: "All habits reset to neutral" });
  } catch (err) {
    res.status(500).json({ message: "Failed to reset habits" });
  }
};


module.exports = {
  createHabit,
  getHabits,
  completeHabit,
  updateHabitName: exports.updateHabitName,
  resetHabits: exports.resetHabits,
};
