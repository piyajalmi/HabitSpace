import { useState } from "react";

const ObjectModal = ({ habit, onClose }) => {
  if (!habit) return null;

  const statusMessages = {
    neutral: "Let’s start building this habit 🌱",
    active: "Great consistency! Keep going 💪",
    flourishing: "Amazing! This habit is thriving 🚀",
    missed: "It’s okay — today is a fresh start 🌤️",
    abandoned: "You can restart anytime 💛",
  };

  const DESCRIPTIONS = {
    plant: "Care for your plant to help it grow every day 🌱",
    lamp: "Focus deeply and work distraction‑free 💡",
    window: "Pause and take mindful breaks 🌤️",
    bookshelf: "Read a little every day 📚",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(habit.habitName || "");

  const saveName = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${import.meta.env.VITE_API_URL}/api/habits/${habit._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ habitName: name }),
      });
    } catch (err) {
      console.error("Failed to update habit name", err);
    }
  };

  const markAsDone = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(
        `${import.meta.env.VITE_API_URL}/api/habits/${habit._id}/complete`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      onClose();
      window.location.reload(); // demo-safe
    } catch (err) {
      console.error("Failed to mark habit done", err);
    }
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeBtn} onClick={onClose}>
          ✕
        </button>

        {isEditing ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={editInput}
            autoFocus
          />
        ) : (
          <h2>{habit.habitName || "New Habit"}</h2>
        )}

        {/* <p style={descStyle}>{DESCRIPTIONS[habit.type]}</p> */}
        <p style={descStyle}>
          {habit.habitName
            ? "Track and grow this habit consistently 🌱"
            : "Start building this habit today ✨"}
        </p>

        <button
          style={editBtn}
          onClick={() => {
            if (isEditing) saveName();
            setIsEditing(!isEditing);
          }}
        >
          {isEditing ? "Save Name" : "Edit Habit Name"}
        </button>

        <div style={sectionBox}>
          <p style={sectionTitle}>📌 Status</p>
          <p style={statusText}>{habit.currentState}</p>
          <p style={encourageText}>{statusMessages[habit.currentState]}</p>
        </div>

        <div style={sectionBox}>
          <p style={sectionTitle}>Weekly Progress</p>
          <div style={progressTrack}>
            <div
              style={{
                ...progressFill,
                width: `${Math.min(habit.consecutiveDays * 10, 100)}%`,
              }}
            />
          </div>
          <div style={metaText}>
            🔥 Streak: <strong>{habit.consecutiveDays} days</strong>
            <br />
            📅 Last completed:{" "}
            <strong>
              {habit.lastCompletedDate
                ? new Date(habit.lastCompletedDate).toDateString()
                : "Not yet"}
            </strong>
          </div>
        </div>

        <button style={primaryBtn} onClick={markAsDone}>
          Mark as Done
        </button>

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
  color: "#b58af6",
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
  background: "#cc9cff",
  transition: "width 0.6s ease",
  boxShadow: "0 0 8px rgba(176, 155, 223, 0.6)",
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
  background: "#b577fc",
  color: "rgb(255, 255, 255)",
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
