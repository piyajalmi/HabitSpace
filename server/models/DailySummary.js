const mongoose = require("mongoose");

const dailySummarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: { type: String }, // YYYY-MM-DD
  totalHabits: Number,
  completed: Number,
  pending: Number,
  midDayNotified: { type: Boolean, default: false },
  eveningNotified: { type: Boolean, default: false },
});

module.exports = mongoose.model("DailySummary", dailySummarySchema);
