import { useState } from "react";
import "../App.css";
import roomImage from "../assets/images/room.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Auth = () => {
  const [mode, setMode] = useState("login"); // login | signup
  const [forgotMode, setForgotMode] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [errors, setErrors] = useState({});

  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const validate = () => {
  const newErrors = {};

  if (mode === "signup" && !name.trim()) {
    newErrors.name = "Name is required";
  }

  if (!email.trim()) {
    newErrors.email = "Email is required";
  }

  if (!forgotMode && !password.trim()) {
    newErrors.password = "Password is required";
  }

  if (mode === "signup" && !forgotMode) {
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  // 🔹 FORGOT PASSWORD
 const handleForgotPassword = async () => {
  if (!email.trim()) {
    setErrors({ email: "Email is required" });
    return;
  }

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();
    setMessage(data.message || "Reset link sent to email");
  } catch {
    setMessage("Something went wrong");
  }
};


  // 🔹 SIGNUP
  const handleSignup = async () => {
  if (!validate()) return;

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/signup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      }
    );

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.name);
      setMessage("Please verify your email to continue.");
    } else {
      setMessage(data.message || "Signup failed");
    }
  } catch {
    setMessage("Something went wrong");
  }
};


  // 🔹 LOGIN
 const handleLogin = async () => {
  if (!validate()) return;

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.name);
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
      <div className="auth-left">
        <img src={roomImage} alt="HabitSpace Room" className="room-image" />
      </div>

      <div className="auth-right">
        <div className="auth-card" style={{ overflow: "hidden" }}>
          <motion.div
            key={mode + forgotMode}
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.45 }}
          >
            <h1 className="auth-title">HabitSpace</h1>
            <p className="auth-subtitle">
              {forgotMode
                ? "Reset Your Password"
                : mode === "signup"
                ? "Enter Your Space"
                : "Welcome Back"}
            </p>

            {/* SIGNUP NAME */}
            {mode === "signup" && !forgotMode && (
  <>
    <input
      type="text"
      placeholder="Name *"
      className="auth-input"
      style={{ borderColor: errors.name ? "red" : "" }}
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
    {errors.name && <p className="error-text">{errors.name}</p>}
  </>
)}


            {/* EMAIL */}
            <>
  <input
    type="email"
    placeholder="Email *"
    className="auth-input"
    style={{ borderColor: errors.email ? "red" : "" }}
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
  {errors.email && <p className="error-text">{errors.email}</p>}
</>


            {/* PASSWORD (not in forgot mode) */}
           {!forgotMode && (
  <>
    <div className="password-wrapper">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password *"
        className="auth-input"
        style={{ borderColor: errors.password ? "red" : "" }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <span className="eye-icon" onClick={() => setShowPassword(p => !p)}>
        {showPassword ? "👀" : "🙈"}
      </span>
    </div>
    {errors.password && <p className="error-text">{errors.password}</p>}
  </>
)}



            {/* CONFIRM PASSWORD */}
          {mode === "signup" && !forgotMode && (
  <>
    <div className="password-wrapper">
      <input
        type={showConfirmPassword ? "text" : "password"}
        placeholder="Confirm Password *"
        className="auth-input"
        style={{ borderColor: errors.confirmPassword ? "red" : "" }}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <span className="eye-icon" onClick={() => setShowConfirmPassword(p => !p)}>
        {showConfirmPassword ? "👀" : "🙈"}
      </span>
    </div>
    {errors.confirmPassword && (
      <p className="error-text">{errors.confirmPassword}</p>
    )}
  </>
)}



            {/* BUTTONS */}
            {forgotMode ? (
              <button className="auth-btn primary" onClick={handleForgotPassword}>
                Send Reset Link
              </button>
            ) : mode === "signup" ? (
              <button className="auth-btn primary" onClick={handleSignup}>
                Sign Up
              </button>
            ) : (
              <button className="auth-btn primary" onClick={handleLogin}>
                Login
              </button>
            )}

            {/* FORGOT PASSWORD LINK */}
            {mode === "login" && !forgotMode && (
              <p
                style={{
                  marginTop: "8px",
                  color: "#4f46e5",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onClick={() => {
                  setForgotMode(true);
                  setMessage("");
                }}
              >
                Forgot Password?
              </p>
            )}

            {/* 🔙 BACK TO LOGIN (THIS IS WHERE IT GOES) */}
            {forgotMode && (
              <p
                style={{
                  marginTop: "10px",
                  color: "#4f46e5",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onClick={() => {
                  setForgotMode(false);
                  setMessage("");
                }}
              >
                Back to Login
              </p>
            )}

            {/* SWITCH LOGIN / SIGNUP */}
            {!forgotMode &&
              (mode === "signup" ? (
                <p className="auth-message">
                  Already have an account?{" "}
                  <span
                    style={{ color: "#4f46e5", cursor: "pointer" }}
                    onClick={() => {
                      setMode("login");
                      setMessage("");
                    }}
                  >
                    Login
                  </span>
                </p>
              ) : (
                <p className="auth-message">
                  New to the space?{" "}
                  <span
                    style={{ color: "#4f46e5", cursor: "pointer" }}
                    onClick={() => {
                      setMode("signup");
                      setMessage("");
                    }}
                  >
                    Sign up
                  </span>
                </p>
              ))}

            {message && <p className="auth-message">{message}</p>}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
