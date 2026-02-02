const Notification = require("../models/Notification");

// 🔔 GET — Fetch unread notifications for logged-in user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
      read: false,
    })
      .sort({ createdAt: -1 })
      .limit(20); // prevent overload

    // Return in format frontend expects
    res.json(
      notifications.map((n) => ({
        id: n._id.toString(),
        message: n.message,
      }))
    );
  } catch (err) {
    console.error("Notification fetch error:", err);
    res.status(500).json({ message: "Failed to load notifications" });
  }
};

// ✅ POST — Mark ALL notifications as read
exports.markAsSeen = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Notification markSeen error:", err);
    res.status(500).json({ message: "Failed to update notifications" });
  }
};
