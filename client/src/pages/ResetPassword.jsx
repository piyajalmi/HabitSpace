import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
//import roomImage from "../assets/room.png";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    if (!password || !confirm) {
      setMessage("All fields required");
      return;
    }

    if (password !== confirm) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("Password reset successful! Redirecting...");
        setTimeout(() => navigate("/"), 2000);
      } else {
        setMessage(data.message);
      }
    } catch {
      setMessage("Something went wrong");
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>Reset Password</h1>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleReset} style={styles.button}>
          Reset Password
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    height: "99.9vh",
    width: "100vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // ⭐ THIS CENTERS THE CARD
    background: "#A8B0C1",
    fontFamily: "'Poppins', system-ui, sans-serif",
  },

  card: {
    background: "linear-gradient(135deg, #CBADA5, #ace1ba)",
    padding: "40px",
    width: "600px",
    borderRadius: "22px",
    textAlign: "center",
    boxShadow: "0 20px 40px #605d64",
  },

  title: {
    fontSize: "40px",
    fontWeight: 600,
    color: "#363945",
    marginBottom: "20px",
  },

  input: {
    background: "linear-gradient(135deg, #E9FBEB, #FDE0F2)",
    width: "90%",
    padding: "12px",
    marginBottom: "14px",
    borderRadius: "14px",
    border: "1px solid #ddd",
    boxShadow: "0 20px 40px #5f5c65",
    outline: "none",
    fontSize: "14px",
    color: "#3b4252",
  },

  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "18px",
    border: "none",
    marginTop: "10px",
    cursor: "pointer",
    fontSize: "14px",
    background: "#707E99",
    color: "white",
    fontWeight: 500,
  },

  message: {
    marginTop: "14px",
    fontSize: "18px",
    color: "#eb4949", // 🔴 red error color
    fontWeight: 500,
  },
};

export default ResetPassword;
