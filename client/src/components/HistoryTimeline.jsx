import { useEffect, useState } from "react";

const HistoryTimeline = ({ onClose }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/activity/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setEvents(data);
    };

    fetchHistory();
  }, []);

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2>Your Activity Timeline</h2>
        <button onClick={onClose} style={closeBtn}>✕</button>

        <div style={timeline}>
          {events.map((e) => (
            <div key={e._id} style={eventCard}>
              <div style={dot} />
              <div>
                <p style={message}>{e.message}</p>
                <p style={date}>{new Date(e.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryTimeline;

/* styles */
const overlay = { position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", justifyContent:"center", alignItems:"center", zIndex:5000 };
const modal = { width:"400px", maxHeight:"80vh", overflowY:"auto", background:"#1e1e2a", padding:"20px", borderRadius:"16px", color:"white", position:"relative" };
const closeBtn = { position:"absolute", right:"14px", top:"10px", background:"none", border:"none", color:"white", fontSize:"18px" };
const timeline = { marginTop:"20px", borderLeft:"2px solid #6c63ff", paddingLeft:"16px" };
const eventCard = { display:"flex", gap:"10px", marginBottom:"16px" };
const dot = { width:"10px", height:"10px", background:"#6c63ff", borderRadius:"50%", marginTop:"6px" };
const message = { fontSize:"14px" };
const date = { fontSize:"11px", opacity:0.6 };
