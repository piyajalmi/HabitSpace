const ObjectModal = ({ object, onClose }) => {
  if (!object) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeBtn} onClick={onClose}>
          ✕
        </button>

        <h2 style={{ marginBottom: "10px" }}>{object.toUpperCase()}</h2>

        <p style={{ opacity: 0.8 }}>Habit details will appear here.</p>
      </div>
    </div>
  );
};

export default ObjectModal;

// ===== styles =====

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle = {
  width: "320px",
  padding: "20px",
  borderRadius: "16px",
  background: "rgba(255,255,255,0.15)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  color: "white",
  position: "relative",
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
};

const closeBtn = {
  position: "absolute",
  top: "10px",
  right: "12px",
  background: "none",
  border: "none",
  color: "white",
  fontSize: "18px",
  cursor: "pointer",
};
