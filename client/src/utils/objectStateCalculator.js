export function getObjectState(habit) {
  if (!habit) return 2; // neutral if no habit

  const today = new Date();
  const last = habit.lastCompletedDate ? new Date(habit.lastCompletedDate) : null;

  if (!last) return 1; // missed

  const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));

  if (diffDays >= 5) return 0; // abandoned
  if (diffDays >= 2) return 1; // missed
  if (habit.consecutiveDays >= 20) return 4; // flourishing
  if (habit.consecutiveDays >= 7) return 3; // active

  return 2; // neutral
}
