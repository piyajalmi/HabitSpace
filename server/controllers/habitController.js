const Habit = require("../models/Habit");
const calculateHabitState = require("../utils/stateCalculator");
const updateDailySummary = require("../utils/updateDailySummary");
const HabitActivity = require("../models/HabitActivity");
const Notification = require("../models/Notification");
// 1️⃣ Create a habit
const createHabit = async (req, res) => {
  try {
   const { type } = req.body;

    const habit = await Habit.create({
      userId: req.user._id,
     type: type, // ✅ unified field
    });

await HabitActivity.create({
  userId: req.user._id,
  habitId: habit._id,
  type: "created",
  message: `New habit started`,
});
await Notification.create({
  userId: req.user._id,
  message: `🌱 New habit "${habit.habitName}" was added!`,
  type: "habit"
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
today.setHours(0, 0, 0, 0);   // normalize to start of today

const last = habit.lastCompletedDate
  ? new Date(habit.lastCompletedDate)
  : null;

if (last) last.setHours(0, 0, 0, 0); // normalize last date

const diffDays = last
  ? Math.floor((today - last) / (1000 * 60 * 60 * 24))
  : null;


    if (diffDays === 1) habit.consecutiveDays += 1;
    else if (diffDays > 1 || diffDays === null) habit.consecutiveDays = 1;
    else if (diffDays === 0) return res.json(habit);

    habit.lastCompletedDate = new Date();
    habit.currentState = calculateHabitState(habit);

   await habit.save();
   await HabitActivity.create({
  userId: req.user._id,
  habitId: habit._id,
  type: "completed",
  message: `${habit.habitName || habit.type} completed`,
  meta: { streak: habit.consecutiveDays },
});
await Notification.create({
  userId: req.user._id,
  message: `✅ You completed "${habit.habitName}" today!`,
  type: "habit"
});

if (habit.consecutiveDays > 1 && habit.consecutiveDays % 5 === 0) {
  await Notification.create({
    userId: req.user._id,
    message: `🔥 ${habit.consecutiveDays} day streak on "${habit.habitName}"!`,
    type: "streak"
  });
}


// 🔔 UPDATE DAILY SUMMARY (for notifications)

// 1️⃣ Count how many habits the user has total
const totalHabits = await Habit.countDocuments({ userId: req.user._id });

// 2️⃣ Count how many were completed today
const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const completedHabits = await Habit.countDocuments({
  userId: req.user._id,
  lastCompletedDate: { $gte: startOfToday },
});
if (habit.consecutiveDays === 7 || habit.consecutiveDays === 30) {
  await HabitActivity.create({
    userId: req.user._id,
    habitId: habit._id,
    type: "streak",
    message: `🔥 ${habit.consecutiveDays} day streak!`,
    meta: { streak: habit.consecutiveDays },
  });
}


// 3️⃣ Update the Daily Summary document
await updateDailySummary(req.user._id, totalHabits, completedHabits);

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
await HabitActivity.create({
  userId: req.user._id,
  type: "reset",
  message: "All habits were reset",
});
await Notification.create({
  userId: req.user._id,
  message: "♻️ Your habit progress was reset.",
  type: "system"
});

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
