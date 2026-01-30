import React from "react";

const ProgressModal = ({ onClose, habits }) => {
  const getStreakText = (habit) => {
    if (!habit.consecutiveDays) return "No streak yet";
    return `${habit.consecutiveDays}-day streak`;
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <button style={closeBtn} onClick={onClose}>✕</button>

        <h2 style={title}>Your Progress 📊</h2>
        <p style={subtitle}>Weekly overview of your habits</p>

        <div style={list}>
          {habits.map((habit) => (
            <div key={habit._id} style={card}>
              <div style={cardTop}>
                <span style={emoji}>{getHabitEmoji(habit.type)}</span>
                <div>
                  <div style={habitName}>{habit.habitName || habit.type}</div>
                  <div style={streak}>{getStreakText(habit)}</div>
                </div>
              </div>

              <div style={grid}>
                {Array.from({ length: 14 }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      ...dot,
                      background:
                        i < habit.consecutiveDays
                          ? "linear-gradient(135deg,#ff9966,#ff5e62)"
                          : "rgba(255,255,255,0.08)",
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressModal;

/* ---------- HELPERS ---------- */

const getHabitEmoji = (type) => {
  switch (type) {
    case "plant":
      return "🌱";
    case "lamp":
      return "💡";
    case "window":
      return "🌤️";
    case "bookshelf":
      return "📚";
    default:
      return "✨";
  }
};

/* ---------- STYLES ---------- */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 4000,
};

const modal = {
  width: "380px",
  maxHeight: "80vh",
  overflowY: "auto",
  borderRadius: "24px",
  padding: "22px",
  background: "linear-gradient(145deg, #1f1f2e, #2b2b3d)",
  backdropFilter: "blur(20px)",
  color: "white",
  position: "relative",
  boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
};

const closeBtn = {
  position: "absolute",
  top: "14px",
  right: "16px",
  background: "none",
  border: "none",
  color: "white",
  fontSize: "18px",
  cursor: "pointer",
};

const title = {
  fontSize: "22px",
  fontWeight: 600,
};

const subtitle = {
  fontSize: "13px",
  opacity: 0.7,
  marginBottom: "18px",
};

const list = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const card = {
  padding: "14px",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(10px)",
};

const cardTop = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "10px",
};

const emoji = {
  fontSize: "22px",
};

const habitName = {
  fontSize: "15px",
  fontWeight: 600,
};

const streak = {
  fontSize: "12px",
  opacity: 0.7,
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(14, 1fr)",
  gap: "4px",
  marginTop: "8px",
};

const dot = {
  width: "100%",
  paddingBottom: "100%",
  borderRadius: "4px",
};


















// const ProgressModal = ({ onClose }) => {
//   return (
//     <div style={overlay} onClick={onClose}>
//       <div style={modal} onClick={(e) => e.stopPropagation()}>
//         <button style={closeBtn} onClick={onClose}>
//           ✕
//         </button>

//         <h2>Your Progress 📊</h2>
//         <p style={{ opacity: 0.7, fontSize: "14px" }}>
//           Weekly overview of your habits
//         </p>

//         <div style={box}>🌱 Plant: 4‑day streak</div>
//         <div style={box}>💡 Focus: 2 sessions</div>
//         <div style={box}>🌤️ Mindfulness: 1‑day streak</div>
//         <div style={box}>📚 Reading: 12‑day streak</div>
//       </div>
//     </div>
//   );
// };

// export default ProgressModal;

// const overlay = {
//   position: "fixed",
//   inset: 0,
//   background: "rgba(0,0,0,0.45)",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   zIndex: 3000,
// };

// const modal = {
//   width: "360px",
//   padding: "22px",
//   borderRadius: "18px",
//   background: "rgba(30,30,40,0.75)",
//   backdropFilter: "blur(16px)",
//   color: "white",
//   position: "relative",
// };

// const closeBtn = {
//   position: "absolute",
//   top: "12px",
//   right: "14px",
//   background: "none",
//   border: "none",
//   color: "white",
//   fontSize: "18px",
//   cursor: "pointer",
// };

// const box = {
//   marginTop: "12px",
//   padding: "12px",
//   borderRadius: "12px",
//   background: "rgba(255,255,255,0.12)",
// };
