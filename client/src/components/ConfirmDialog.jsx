import { motion } from "framer-motion";

const ConfirmDialog = ({ title, message, confirmText, cancelText, onConfirm, onCancel }) => {
  return (
    <div style={overlay}>
      <motion.div
        style={modal}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <h3 style={titleStyle}>{title}</h3>
        <p style={messageStyle}>{message}</p>

        <div style={buttonRow}>
          <button style={cancelBtn} onClick={onCancel}>
            {cancelText || "Cancel"}
          </button>
          <button style={confirmBtn} onClick={onConfirm}>
            {confirmText || "Confirm"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmDialog;

/* ---------- STYLES ---------- */

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.55)",
  backdropFilter: "blur(6px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 5000,
};

const modal = {
  width: "380px",
  padding: "24px",
  borderRadius: "20px",
  background: "linear-gradient(145deg, #1f1f2e, #2b2b3d)",
  color: "white",
  boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
  textAlign: "center",
};

const titleStyle = {
  fontSize: "20px",
  fontWeight: 600,
  marginBottom: "8px",
};

const messageStyle = {
  fontSize: "14px",
  opacity: 0.8,
  marginBottom: "20px",
};

const buttonRow = {
  display: "flex",
  justifyContent: "center",
  gap: "12px",
};

const cancelBtn = {
  padding: "10px 16px",
  borderRadius: "10px",
  border: "none",
  background: "rgba(255,255,255,0.12)",
  color: "white",
  cursor: "pointer",
};

const confirmBtn = {
  padding: "10px 16px",
  borderRadius: "10px",
  border: "none",
  background: "linear-gradient(135deg,#ff9966,#ff5e62)",
  color: "white",
  cursor: "pointer",
};
