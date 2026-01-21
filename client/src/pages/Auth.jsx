import { useState } from "react";
import "../App.css";
import roomImage from "../assets/images/room.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Auth = () => {
  const [mode, setMode] = useState("signup"); // signup | login
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setMessage("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

if (data.token) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("userName", data.name);

  setMessage("Please verify your email to continue.");
  // ❌ DO NOT navigate to /room


} else {
  setMessage(data.message || "Signup failed");
}


    } catch {
      setMessage("Something went wrong");
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Email and password are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token) {
  localStorage.setItem("token", data.token);

  if (data.name) {
    localStorage.setItem("userName", data.name);
  }

  navigate("/room");


      } else {
        setMessage(data.message);
      }
    } catch {
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="auth-page">
      {/* Left image */}
      <div className="auth-left">
        <img
          src={roomImage}
          alt="HabitSpace Room"
          className="room-image"
        />
      </div>

      {/* Right card */}
      <div className="auth-right">
        <div className="auth-card" style={{ overflow: "hidden" }}>
          <motion.div
            key={mode}
            initial={{ x: mode === "signup" ? 80 : -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <h1 className="auth-title">HabitSpace</h1>
            <p className="auth-subtitle">
              {mode === "signup" ? "Enter Your Space" : "Welcome Back"}
            </p>

            {/* SIGNUP ONLY */}
            {mode === "signup" && (
              <input
                type="text"
                placeholder="Name"
                className="auth-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <input
              type="email"
              placeholder="Email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* SIGNUP ONLY */}
            {mode === "signup" && (
              <input
                type="password"
                placeholder="Confirm Password"
                className="auth-input"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />
            )}

            {mode === "signup" ? (
              <button
                className="auth-btn primary"
                onClick={handleSignup}
              >
                Sign Up
              </button>
            ) : (
              <button
                className="auth-btn primary"
                onClick={handleLogin}
              >
                Login
              </button>
            )}

            {/* 🔹 TEXT LINKS INSTEAD OF BUTTONS */}
            {mode === "signup" ? (
              <p className="auth-message">
                Already have an account?{" "}
                <span
                  style={{
                    color: "#4f46e5",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                  onClick={() => {
  setMessage("");
  setMode("login");
}}

                >
                  Login
                </span>
              </p>
            ) : (
              <p className="auth-message">
                New to the space?{" "}
                <span
                  style={{
                    color: "#4f46e5",
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                  onClick={() => {
  setMessage("");
  setMode("signup");
}}

                >
                  Sign up
                </span>
              </p>
            )}

            {message && <p className="auth-message">{message}</p>}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
