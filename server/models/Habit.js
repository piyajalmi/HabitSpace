const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    // Which user this habit belongs to
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    habitName: {
      type: String,
      default: "",
    },

    // What object this habit represents in the room
    type: {
      type: String,
      enum: ["plant", "lamp", "window", "bookshelf"],
      required: true,
    },

    // Current visual/state of the habit
    currentState: {
      type: String,
      enum: ["neutral", "active", "flourishing", "missed", "abandoned"],
      default: "neutral",
    },

    // Number of consecutive days completed
    consecutiveDays: {
      type: Number,
      default: 0,
    },

    // Last day the habit was completed
    lastCompletedDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  },
);

module.exports = mongoose.model("Habit", habitSchema);
