const DailySummary = require("../models/DailySummary");
const getToday = require("../utils/getToday");

const getOrCreateTodaySummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = getToday();

    let summary = await DailySummary.findOne({ userId, date: today });

    if (!summary) {
      // ⚠️ TEMP values (we’ll compute later)
     summary = await DailySummary.create({
  userId,
  date: today,
  totalHabits: 0,
  completed: 0,
  pending: 0,
});

    }

    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getOrCreateTodaySummary };
