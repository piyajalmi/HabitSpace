const cron = require("node-cron");
const DailySummary = require("../models/DailySummary");
const getToday = require("./getToday");

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

  /* 🌞 MIDDAY REMINDER — 1:00 PM */
  cron.schedule("0 13 * * *", async () => {
    console.log("☀️ Midday notification check");

    const today = getToday();

    const summaries = await DailySummary.find({
      date: today,
      pending: { $gt: 0 },
      midDayNotified: false,
    });

    for (const s of summaries) {
      console.log(`🔔 MIDDAY for user ${s.userId}:`, pick(midDayMessages));

      s.midDayNotified = true;
      await s.save();
    }
  });

  /* 🌆 EVENING REMINDER — 7:00 PM */
  cron.schedule("0 19 * * *", async () => {
    console.log("🌙 Evening notification check");

    const today = getToday();

    const summaries = await DailySummary.find({
      date: today,
      pending: { $gt: 0 },
      eveningNotified: false,
    });

    for (const s of summaries) {
      console.log(`🔔 EVENING for user ${s.userId}:`, pick(eveningMessages));

      s.eveningNotified = true;
      await s.save();
    }
  });

  /* 🌙 RESET FLAGS AT MIDNIGHT FOR NEW DAY */
  cron.schedule("0 0 * * *", async () => {
    console.log("🌙 Resetting notification flags for new day");

    const today = getToday();

    await DailySummary.updateMany(
      { date: today },
      { midDayNotified: false, eveningNotified: false }
    );
  });
};

module.exports = startNotificationScheduler;
