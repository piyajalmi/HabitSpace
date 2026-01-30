// utils/objectStateCalculator.js

import { ROOM_STATES } from "./roomState";

export function getObjectState(habit) {
  if (!habit) return ROOM_STATES.NEUTRAL;

  switch (habit.currentState) {
    case "abandoned":
      return ROOM_STATES.ABANDONED;
    case "missed":
      return ROOM_STATES.MISSED;
    case "neutral":
      return ROOM_STATES.NEUTRAL;
    case "active":
      return ROOM_STATES.ACTIVE;
    case "flourishing":
      return ROOM_STATES.FLOURISHING;
    default:
      return ROOM_STATES.NEUTRAL;
  }
}

