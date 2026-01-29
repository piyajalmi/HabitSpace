import { useState } from "react";

const ObjectModal = ({ object, onClose }) => {
  if (!object) return null;

  const HABIT_CONFIG = {
    plant: {
      defaultName: "Water the Plant",
      description: "Care for your plant to help it grow every day 🌱",
      status: "Active",
      streak: 4,
      lastCompleted: "Yesterday",
      progress: 60,
    },
    lamp: {
      defaultName: "Focus Session",
      description: "Turn on focus mode and work distraction‑free 💡",
      status: "Neutral",
      streak: 0,
      lastCompleted: "Yesterday",
      progress: 20,
    },
    window: {
      defaultName: "Mindful Break",
      description: "Pause and reflect for a few minutes 🌤️",
      status: "Missed",
      streak: 1,
      lastCompleted: "Yesterday",
      progress: 35,
    },
    bookshelf: {
      defaultName: "Read Books",
      description: "Read at least a few pages today 📚",
      status: "Flourishing",
      streak: 12,
      lastCompleted: "Yesterday",
      progress: 85,
    },
  };

  const ENCOURAGEMENT = {
    Active: "Great consistency! Keep going 🌱",
    Neutral: "Let’s build this habit step by step 💪",
    Missed: "It’s okay — today is a fresh start 🌤️",
    Flourishing: "Amazing! This habit is thriving 🚀",
  };

  const habit = HABIT_CONFIG[object];

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(habit.defaultName);

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeBtn} onClick={onClose}>
          ✕
        </button>

        {/* HEADER */}
        {isEditing ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={editInput}
            autoFocus
          />
        ) : (
          <h2 style={{ marginBottom: "4px" }}>{name}</h2>
        )}

        <p style={descStyle}>{habit.description}</p>

        <button style={editBtn} onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Save Name" : "Edit Habit Name"}
        </button>

        {/* STATUS */}
        <div style={sectionBox}>
          <p style={sectionTitle}>📌 Status</p>
          <p style={statusText}>{habit.status}</p>
          <p style={encourageText}>{ENCOURAGEMENT[habit.status]}</p>
        </div>

        {/* PROGRESS */}
        <div style={sectionBox}>
          <p style={sectionTitle}>Weekly Progress</p>

          <div style={progressTrack}>
            <div
              style={{
                ...progressFill,
                width: `${habit.progress}%`,
              }}
            />
          </div>

          <div style={metaText}>
            🔥 Streak: <strong>{habit.streak} days</strong>
            <br />
            📅 Last completed: <strong>{habit.lastCompleted}</strong>
          </div>
        </div>

        {/* ACTION */}
        <button style={primaryBtn}>Mark as Done</button>

        <p style={footerText}>Progress updates visually in the room.</p>
      </div>
    </div>
  );
};

export default ObjectModal;

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle = {
  width: "360px",
  padding: "22px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.12)",
  backdropFilter: "blur(16px)",
  color: "white",
  position: "relative",
};

const closeBtn = {
  position: "absolute",
  top: "12px",
  right: "14px",
  background: "none",
  border: "none",
  color: "white",
  fontSize: "18px",
  cursor: "pointer",
};

const editInput = {
  width: "100%",
  fontSize: "18px",
  padding: "8px",
  borderRadius: "8px",
  border: "none",
};

const editBtn = {
  marginTop: "6px",
  background: "none",
  border: "none",
  color: "#9cff9c",
  cursor: "pointer",
  fontSize: "13px",
};

const sectionBox = {
  marginTop: "14px",
  padding: "14px",
  borderRadius: "14px",
  background: "rgba(255,255,255,0.18)",
};

const sectionTitle = {
  fontSize: "12px",
  opacity: 0.7,
  marginBottom: "6px",
};

const statusText = {
  fontSize: "15px",
  fontWeight: 600,
};

const encourageText = {
  fontSize: "13px",
  opacity: 0.85,
  marginTop: "4px",
};

const progressTrack = {
  height: "8px",
  background: "rgba(255,255,255,0.25)",
  borderRadius: "10px",
  overflow: "hidden",
};

const progressFill = {
  height: "100%",
  background: "#9cff9c",
  transition: "width 0.6s ease",
  boxShadow: "0 0 8px rgba(156,255,156,0.6)",
};

const metaText = {
  marginTop: "10px",
  fontSize: "13px",
  opacity: 0.9,
};

const primaryBtn = {
  marginTop: "18px",
  width: "100%",
  padding: "12px",
  borderRadius: "14px",
  border: "none",
  background: "#9cff9c",
  color: "#063",
  fontWeight: 700,
  cursor: "pointer",
};

const descStyle = {
  fontSize: "13px",
  opacity: 0.7,
};

const footerText = {
  fontSize: "12px",
  opacity: 0.6,
  marginTop: "10px",
};
