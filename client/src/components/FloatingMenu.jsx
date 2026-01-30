import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FloatingMenu = ({
  onPauseToggle,
  isPaused,
  onReset,
  onProgress,
  onGuide,
}) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");

    navigate("/", { replace: true });
  };

  return (
    <div style={container}>
      {open && (
        <div style={menu}>
          <button onClick={onPauseToggle}>
            {isPaused ? "▶ Resume Habits" : "⏸ Pause Habits"}
          </button>
          <button style={menuBtn} onClick={onProgress}>
            📊 Your Progress
          </button>
          <button style={menuBtn} onClick={onGuide}>
            📖 Guide
          </button>
          <button style={menuBtn} onClick={onReset}>
            🔄 Reset Room
          </button>
          <button style={menuBtn} onClick={logout}>
            🚪 Logout
          </button>
        </div>
      )}

      <button
        style={{
          ...fab,
          transform: open ? "rotate(90deg)" : "rotate(0deg)",
        }}
        onClick={() => setOpen(!open)}
      >
        {open ? "✕" : "☰"}
      </button>
    </div>
  );
};

export default FloatingMenu;

/* ---------- STYLES ---------- */

const container = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  zIndex: 2000,
};

const fab = {
  position: "fixed",
  bottom: "22px",
  right: "22px",
  width: "58px",
  height: "58px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "24px",
  lineHeight: "1",
  background: "rgb(134, 67, 241)",
  color: "white",
  cursor: "pointer",
  zIndex: 9999, // 🔥 FORCE TOP
  pointerEvents: "auto", // 🔥 IMPORTANT
};

const menu = {
  position: "fixed",
  bottom: "92px", // 👈 sits ABOVE the FAB
  right: "22px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  padding: "14px",
  borderRadius: "18px",
  background: "rgba(30, 30, 40, 0.75)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
  zIndex: 1100,
};

const menuBtn = {
  background: "rgba(255,255,255,0.12)",
  border: "none",
  color: "white",
  padding: "12px 14px",
  borderRadius: "12px",
  fontSize: "14px",
  fontWeight: 500,
  cursor: "pointer",
  textAlign: "left",
};
