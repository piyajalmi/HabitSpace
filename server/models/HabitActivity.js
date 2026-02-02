const mongoose = require("mongoose");

const habitActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    habitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
    },
    type: {
      type: String,
      enum: ["created", "completed", "streak", "reset"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    meta: {
      streak: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HabitActivity", habitActivitySchema);
