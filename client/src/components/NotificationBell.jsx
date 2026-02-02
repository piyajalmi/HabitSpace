import { useEffect, useState, useRef } from "react";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef();

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setNotifications(data);
  };

  const markSeen = async () => {
    const token = localStorage.getItem("token");
    await fetch(`${import.meta.env.VITE_API_URL}/api/notifications/seen`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  // 🔁 Auto refresh every 5s (no reload needed)
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  // 🖱 Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = async () => {
    setOpen((prev) => !prev);
    if (notifications.length > 0) {
      await markSeen();
      // ⏳ Keep them visible for 10 seconds before clearing
        if (clearTimer.current) clearTimeout(clearTimer.current);
        clearTimer.current = setTimeout(() => {
          setVisibleNotifications([]);
        }, 10000);
      }
    };
 // refresh after marking seen
  return (
    <div ref={wrapperRef} style={wrapper}>
      <div style={bell} onClick={handleBellClick}>
        🔔
        {notifications.length > 0 && <span style={dot} />}
      </div>

      {open && (
        <div style={dropdown}>
          {notifications.length === 0 ? (
            <div style={empty}>No notifications yet 🌱</div>
          ) : (
            notifications.map((n) => (
              <div key={n.id} style={item}>{n.message}</div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;

/* ================= STYLES ================= */

const wrapper = {
  position: "fixed",
  top: "90px",        // below welcome toast
  right: "25px",
  zIndex: 6000,
};

const bell = {
  fontSize: "24px",
  cursor: "pointer",
  position: "relative",
};

const dot = {
  position: "absolute",
  top: "-2px",
  right: "-2px",
  width: "9px",
  height: "9px",
  background: "#ff4d4d",
  borderRadius: "50%",
};

const dropdown = {
  position: "absolute",
  top: "38px",        // directly below bell
  right: 0,
  width: "280px",
  background: "#1e1e2a",
  borderRadius: "14px",
  padding: "14px",
  boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const item = {
  fontSize: "14px",
  color: "white",
  background: "rgba(255,255,255,0.06)",
  padding: "8px 10px",
  borderRadius: "8px",
};

const empty = {
  fontSize: "14px",
  color: "#aaa",
  textAlign: "center",
};
