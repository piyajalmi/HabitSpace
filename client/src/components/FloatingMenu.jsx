import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FloatingMenu = ({ onResetRoom }) => {
  const [open, setOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      {open && (
        <div style={menu}>
          <button
            style={item}
            onClick={() => {
              setPaused(!paused);
              alert(paused ? "Habits resumed" : "Habits paused");
            }}
          >
            {paused ? "▶️ Resume Habits" : "⏸️ Pause Habits"}
          </button>

          <button
            style={item}
            onClick={() => alert("Progress modal coming next 👀")}
          >
            📊 Your Progress
          </button>

          <button
            style={item}
            onClick={() => alert("Guide modal coming next 📖")}
          >
            📖 Guide / How it works
          </button>

          <button
            style={item}
            onClick={() => {
              if (confirm("Reset room progress?")) {
                onResetRoom?.();
              }
            }}
          >
            🔄 Reset Room
          </button>

          <button style={{ ...item, color: "#ff8b8b" }} onClick={logout}>
            🚪 Logout
          </button>
        </div>
      )}

      <button style={fab} onClick={() => setOpen(!open)}>
        {open ? "✕" : "☰"}
      </button>
    </>
  );
};

export default FloatingMenu;

/* ---------- STYLES ---------- */

const fab = {
  position: "fixed",
  bottom: "24px",
  right: "24px",
  width: "56px",
  height: "56px",
  borderRadius: "50%",
  background: "#6d4be8f3",
  border: "none",
  fontSize: "24px",
  fontWeight: "bold",
  cursor: "pointer",
  zIndex: 1001,
};

const menu = {
  position: "fixed",
  bottom: "90px",
  right: "24px",
  background: "rgba(40,40,40,0.9)",
  backdropFilter: "blur(12px)",
  borderRadius: "16px",
  padding: "12px",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  zIndex: 1000,
};

const item = {
  background: "none",
  border: "none",
  color: "white",
  fontSize: "14px",
  textAlign: "left",
  cursor: "pointer",
};
