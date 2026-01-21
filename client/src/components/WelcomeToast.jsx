import { useEffect, useState } from "react";
import "./WelcomeToast.css";

const ROOM_STATE_MESSAGES = {
  0: "Welcome back, {name}. Let’s rebuild your space 🛠️",
  1: "Welcome back, {name}. You’ve got this 🌱",
  2: "Welcome to your space, {name} ✨",
  3: "Great to see you, {name}! Keep the momentum 🔥",
  4: "Your space is flourishing, {name} 🌿✨",
};

const WelcomeToast = ({
  userName = "Piya", // 🔒 STATIC FOR NOW
  roomState = 1,
  duration = 4000,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  const stateKey = Number(roomState);

  const messageTemplate =
    ROOM_STATE_MESSAGES[stateKey] || ROOM_STATE_MESSAGES[2];

  const message = messageTemplate.replace("{name}", userName);

  return (
    <div className="welcome-toast">
      <span>{message}</span>
      <div
        className="toast-progress"
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  );
};

export default WelcomeToast;
