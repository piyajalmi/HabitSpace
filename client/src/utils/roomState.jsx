// utils/roomState.js

export const ROOM_STATES = {
  ABANDONED: 0,
  MISSED: 1,
  NEUTRAL: 2,
  ACTIVE: 3,
  FLOURISHING: 4,
};

export const ROOM_STATE_CONFIG = {
  0: {
    name: "abandoned",
    lamp: "abandoned",
    plant: "abandoned",
    bookshelf: "abandoned",
    window: "abandoned",
  },
  1: {
    name: "missed",
    lamp: "missed",
    plant: "missed",
    bookshelf: "missed",
    window: "missed",
  },
  2: {
    name: "neutral",
    lamp: "neutral",
    plant: "neutral",
    bookshelf: "neutral",
    window: "neutral",
  },
  3: {
    name: "active",
    lamp: "active",
    plant: "active",
    bookshelf: "active",
    window: "active",
  },
  4: {
    name: "flourishing",
    lamp: "flourishing",
    plant: "flourishing",
    bookshelf: "flourishing",
    window: "flourishing",
  },
};

export function getRoomState(habit) {
  if (!habit?.lastCompletedDate) return 2;

  const today = new Date();
  const last = new Date(habit.lastCompletedDate);

  const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));

  if (diffDays >= 7) return 0;
  if (diffDays >= 2) return 1;
  if (habit.streak >= 21) return 4;
  if (habit.streak >= 11) return 3;

  return 2;
}
