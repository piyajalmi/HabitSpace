const cron = require("node-cron");
const DailySummary = require("../models/DailySummary");

const midDayMessages = [
  "🌱 Halfway through the day — how are your habits going?",
  "Quick check‑in! Small steps still count ✨",
];

const eveningMessages = [
  "⏳ The day isn’t over yet — one small win counts",
  "Your future self will thank you 🌿",
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const startNotificationScheduler = () => {
  // 🧪 TEMP TEST: runs every minute
  cron.schedule("* * * * *", async () => {
    console.log("⏰ Cron tick - scheduler alive");
    try {
      const summaries = await DailySummary.find({
        pending: { $gt: 0 },
        midDayNotified: false,
      });

      summaries.forEach(async (s) => {
        console.log("🔔 MIDDAY TEST:", pick(midDayMessages));

        s.midDayNotified = true;
        await s.save();
      });
    } catch (err) {
      console.error("Notification error:", err);
    }
  });
};

module.exports = startNotificationScheduler;
