const HabitActivity = require("../models/HabitActivity");

// Get user activity history
exports.getUserActivity = async (req, res) => {
  try {
    const activities = await HabitActivity.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch activity history" });
  }
};
