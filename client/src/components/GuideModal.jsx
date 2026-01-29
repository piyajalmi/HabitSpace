const GuideModal = ({ onClose }) => {
  return (
    <div style={overlay} onClick={onClose}>
      <div style={modal} onClick={(e) => e.stopPropagation()}>
        <button style={closeBtn} onClick={onClose}>
          ✕
        </button>

        <h1 style={title}>Welcome to HabitSpace 🌱</h1>
        <p style={subtitle}>
          A calm space where your everyday habits slowly shape your world.
        </p>

        {/* SECTION CARD */}
        <div style={card}>
          <h3>🏠 Your Room</h3>
          <p>
            This room is a visual reflection of your habits. The more consistent
            you are, the more alive it feels.
          </p>
        </div>

        <div style={card}>
          <h3>🌿 Habit Objects</h3>

          <div style={item}>
            🌱{" "}
            <span>
              <b>Plant</b>
              <br />
              Self‑care & health
            </span>
          </div>
          <div style={item}>
            💡{" "}
            <span>
              <b>Lamp</b>
              <br />
              Focus & productivity
            </span>
          </div>
          <div style={item}>
            🌤️{" "}
            <span>
              <b>Window</b>
              <br />
              Mindfulness & breaks
            </span>
          </div>
          <div style={item}>
            📚{" "}
            <span>
              <b>Bookshelf</b>
              <br />
              Learning & reading
            </span>
          </div>

          <p style={hint}>
            Tip: Click any object to view details and update progress.
          </p>
        </div>

        <div style={card}>
          <h3>📈 Growth & Progress</h3>
          <p>
            Completing habits builds streaks and improves the room visually.
            Missed days may slow growth — but nothing is permanent.
          </p>
        </div>

        <div style={card}>
          <h3>☰ Quick Actions</h3>

          <ul style={softList}>
            <li>⏸️ Pause habits without losing history</li>
            <li>📊 View your weekly progress</li>
            <li>🔄 Reset the room visuals anytime</li>
            <li>🚪 Logout securely</li>
          </ul>
        </div>

        <div style={card}>
          <h3>🔒 Your Data</h3>
          <p>
            Your habits are private and tied to your account. Resetting the room
            never deletes your data.
          </p>
        </div>

        <p style={footer}>Small steps every day create meaningful change 🌿</p>
      </div>
    </div>
  );
};

export default GuideModal;

/* ---------- STYLES ---------- */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 4000,
};

const modal = {
  width: "520px",
  maxHeight: "85vh",
  overflowY: "auto",
  padding: "26px",
  borderRadius: "22px",
  background: "rgba(30,30,40,0.9)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  color: "white",
  position: "relative",
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
  fontSize: "30px",
  marginBottom: "6px",
};

const subtitle = {
  opacity: 0.75,
  marginBottom: "18px",
  fontSize: "15px",
};

const card = {
  background: "rgba(255,255,255,0.08)",
  borderRadius: "18px",
  padding: "16px",
  marginBottom: "14px",
};

const item = {
  display: "flex",
  gap: "10px",
  alignItems: "flex-start",
  marginBottom: "10px",
  fontSize: "14px",
};

const hint = {
  fontSize: "12px",
  opacity: 0.65,
  marginTop: "6px",
};

const softList = {
  paddingLeft: "16px",
  lineHeight: "1.6",
  fontSize: "14px",
};

const footer = {
  textAlign: "center",
  marginTop: "20px",
  opacity: 0.6,
  fontSize: "13px",
};
