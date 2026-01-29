const ProgressModal = ({ onClose }) => {
  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <button style={closeBtn} onClick={onClose}>
          ✕
        </button>

        <h2>Your Progress 📊</h2>
        <p style={{ opacity: 0.7, fontSize: "14px" }}>
          Weekly overview of your habits
        </p>

        <div style={box}>🌱 Plant: 4‑day streak</div>
        <div style={box}>💡 Focus: 2 sessions</div>
        <div style={box}>📚 Reading: 12‑day streak</div>
      </div>
    </div>
  );
};

export default ProgressModal;

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 3000,
};

const modal = {
  width: "360px",
  padding: "22px",
  borderRadius: "18px",
  background: "rgba(30,30,40,0.75)",
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

const box = {
  marginTop: "12px",
  padding: "12px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.12)",
};
