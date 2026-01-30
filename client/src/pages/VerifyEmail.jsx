import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const hasCalled = useRef(false); // ✅ prevents double call

  const [status, setStatus] = useState("verifying"); 
  // verifying | success | error

  useEffect(() => {
    if (hasCalled.current) return; // 🛑 stop second call
    hasCalled.current = true;

    const verify = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/verify-email/${token}`
        );
        const data = await res.json();

        if (res.ok) {
          setStatus("success");

          // ⏳ redirect to login after 2 sec
          setTimeout(() => navigate("/"), 2000);
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div style={styles.wrapper}>
      {status === "verifying" && <h2>Verifying your email...</h2>}
      {status === "success" && <h2>✅ Email verified! Redirecting to login...</h2>}
      {status === "error" && <h2>❌ Verification failed or already used.</h2>}
    </div>
  );
};

export default VerifyEmail;

const styles = {
  wrapper: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Poppins, sans-serif",
  },
};
