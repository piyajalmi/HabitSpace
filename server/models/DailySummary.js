const mongoose = require("mongoose");

const dailySummarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true }, // YYYY-MM-DD

  totalHabits: { type: Number, default: 0 },
  completed: { type: Number, default: 0 },
  pending: { type: Number, default: 0 },

  midDayNotified: { type: Boolean, default: false },
  eveningNotified: { type: Boolean, default: false },
});

module.exports = mongoose.model("DailySummary", dailySummarySchema);
