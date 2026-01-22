const DailySummary = require("../models/DailySummary");
const getToday = require("./getToday");

const updateDailySummary = async (userId, totalHabits, completedHabits) => {
  const today = getToday();
  const pending = totalHabits - completedHabits;

  await DailySummary.findOneAndUpdate(
    { userId, date: today },
    {
      userId,
      date: today,
      totalHabits,
      completed: completedHabits,
      pending,
    },
    {
      new: true,
      upsert: true, // 🔥 THIS IS THE KEY FIX
      setDefaultsOnInsert: true,
    }
  );
};

module.exports = updateDailySummary;
