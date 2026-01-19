import { useState } from "react";
import "../App.css";
import roomImage from "../assets/images/room.png";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    if (!email || !password) {
      setMessage("Email and password are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setMessage(data.message || "Signup success");
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
        setMessage("Login successful");
      } else {
        setMessage(data.message);
      }
    } catch {
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="auth-page">
      {/* Left side image */}
      <div className="auth-left">
        <img src={roomImage} alt="HabitSpace Room" className="room-image" />
      </div>

      {/* Right side auth card */}
      <div className="auth-right">
        <div className="auth-card">
          <h1 className="auth-title">HabitSpace</h1>
          <p className="auth-subtitle">Enter Your Space</p>

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

          <button className="auth-btn primary" onClick={handleSignup}>
            Sign Up
          </button>

          <button className="auth-btn secondary" onClick={handleLogin}>
            Login
          </button>

          {message && <p className="auth-message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Auth;

/* working code temporarily commented to text the frontend*/
// import { useState } from "react";

// const Auth = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");

//   const handleSignup = async () => {
//     if (!email || !password) {
//       setMessage("Email and password are required");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:5000/api/auth/signup", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();
//       setMessage(data.message || "Signup success");
//     } catch (err) {
//       setMessage("Something went wrong");
//     }
//   };

//   const handleLogin = async () => {
//     if (!email || !password) {
//       setMessage("Email and password are required");
//       return;
//     }

//     try {
//       const res = await fetch("http://localhost:5000/api/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (data.token) {
//         localStorage.setItem("token", data.token);
//         setMessage("Login successful");
//       } else {
//         setMessage(data.message);
//       }
//     } catch (err) {
//       setMessage("Something went wrong");
//     }
//   };

//   return (
//     <div style={{ padding: "40px" }}>
//       <h2>Auth Test</h2>

//       <input
//         type="email"
//         placeholder="Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <br /><br />

//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <br /><br />

//       <button onClick={handleSignup}>Signup</button>
//       <button onClick={handleLogin} style={{ marginLeft: "10px" }}>
//         Login
//       </button>

//       <p>{message}</p>
//     </div>
//   );
// };

// export default Auth;
