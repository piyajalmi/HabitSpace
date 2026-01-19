const calculateHabitState = (habit) => {
  const { lastCompletedDate, consecutiveDays } = habit;

  // 1. Never completed
  if (!lastCompletedDate) {
    return "neutral";
  }

  const today = new Date();
  const lastDate = new Date(lastCompletedDate);

  // Normalize dates (ignore time)
  today.setHours(0, 0, 0, 0);
  lastDate.setHours(0, 0, 0, 0);

  const diffTime = today - lastDate;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);

  // 2. Completed today or yesterday
  if (diffDays <= 1) {
    if (consecutiveDays >= 30) {
      return "flourishing";
    }
    return "active";
  }

  // 3. Missed recently
  if (diffDays <= 6) {
    return "missed";
  }

  // 4. Missed for long time
  return "abandoned";
};

module.exports = calculateHabitState;
