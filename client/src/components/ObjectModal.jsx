import { useState, useEffect } from "react";

const ObjectModal = ({ habit, onClose, onHabitUpdated, isPaused }) => {
  if (!habit) return null;

  const statusMessages = {
    neutral: "Let’s start building this habit 🌱",
    active: "Great consistency! Keep going 💪",
    flourishing: "Amazing! This habit is thriving 🚀",
    missed: "It’s okay — today is a fresh start 🌤️",
    abandoned: "You can restart anytime 💛",
  };

  const DESCRIPTIONS = {
    plant: "Care for your plant to help it grow every day 🌱",
    lamp: "Focus deeply and work distraction‑free 💡",
    window: "Pause and take mindful breaks 🌤️",
    bookshelf: "Read a little every day 📚",
  };

  const defaultHabitNames = {
    plant: "Drink 2LWater Daily 💧",
    lamp: "Meditation 💡",
    window: "Exposure to Sunlight for 10mins 🌤️",
    bookshelf: "Everyday Journaling 📚",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(
    habit.habitName || defaultHabitNames[habit.type],
  );
  useEffect(() => {
    setName(habit.habitName || defaultHabitNames[habit.type]);
  }, [habit]);

  const isNameValid =
    name.trim() !== "" && name !== defaultHabitNames[habit.type];
  const saveName = async () => {
    if (!habit?._id) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/habits/${habit._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ habitName: name }),
        },
      );

      const updatedHabit = await res.json();
      onHabitUpdated(updatedHabit);
    } catch (err) {
      console.error("Failed to update habit name", err);
    }
  };

  const markAsDone = async () => {
    if (!habit?._id) {
      console.error("Habit ID missing — blocking request");
      return;
    }

    if (isPaused) {
      alert("⏸ Habits are paused. Resume to continue.");
      return;
    }

    if (!isNameValid) {
      alert("Please give your habit a name before marking it done.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/habits/${habit._id}/complete`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!res.ok) throw new Error("Failed request");

      const updatedHabit = await res.json();
      onHabitUpdated(updatedHabit);
    } catch (err) {
      console.error("Failed to mark habit done", err);
    }
  };

  const completedToday = habit.lastCompletedDate
    ? new Date(habit.lastCompletedDate).toDateString() ===
      new Date().toDateString()
    : false;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <button style={closeBtn} onClick={onClose}>
          ✕
        </button>

        {isEditing ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={editInput}
            autoFocus
          />
        ) : (
          <h2>{name}</h2>
        )}

        <p style={descStyle}>{DESCRIPTIONS[habit.type]}</p>

        <button
          style={editBtn}
          onClick={() => {
            if (isEditing) saveName();
            setIsEditing(!isEditing);
          }}
        >
          {isEditing ? "Save Name" : "Edit Habit Name"}
        </button>

        <div style={sectionBox}>
          <p style={sectionTitle}>📌 Status</p>
          <p style={statusText}>{habit.currentState}</p>
          <p style={encourageText}>{statusMessages[habit.currentState]}</p>
        </div>

        <div style={sectionBox}>
          <p style={sectionTitle}>Weekly Progress</p>

          <div style={progressTrack}>
            <div
              style={{
                ...progressFill,
                width: `${Math.min(habit.consecutiveDays * 10, 100)}%`,
              }}
            />
          </div>

          <div style={metaText}>
            🔥 Streak: <strong>{habit.consecutiveDays} days</strong>
            <br />
            📅 Last completed:{" "}
            <strong>
              {habit.lastCompletedDate
                ? new Date(habit.lastCompletedDate).toDateString()
                : "Not yet"}
            </strong>
          </div>
        </div>

        <button
          style={{
            ...primaryBtn,
            opacity: isPaused || !isNameValid || completedToday ? 0.5 : 1,
            cursor:
              isPaused || !isNameValid || completedToday
                ? "not-allowed"
                : "pointer",
          }}
          onClick={markAsDone}
          disabled={isPaused || !isNameValid || completedToday}
        >
          {isPaused
            ? "Paused"
            : completedToday
              ? "Already done today"
              : !isNameValid
                ? "Name your habit first"
                : "Mark as Done"}
        </button>

        <p style={footerText}>Progress updates visually in the room.</p>
      </div>
    </div>
  );
};

export default ObjectModal;

/* ================= STYLES ================= */

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle = {
  width: "360px",
  padding: "22px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.12)",
  backdropFilter: "blur(16px)",
  color: "white",
  position: "relative",
};

const closeBtn = {
  position: "absolute",
  top: "12px",
  right: "14px",
  background: "none",
  border: "none",
  color: "white",
  fontSize: "18px",
  cursor: "pointer",
};

const editInput = {
  width: "100%",
  fontSize: "18px",
  padding: "8px",
  borderRadius: "8px",
  border: "none",
};

const editBtn = {
  marginTop: "6px",
  background: "none",
  border: "none",
  color: "#ded522",
  cursor: "pointer",
  fontSize: "13px",
};

const sectionBox = {
  marginTop: "14px",
  padding: "14px",
  borderRadius: "14px",
  background: "rgba(255,255,255,0.18)",
};

const sectionTitle = {
  fontSize: "12px",
  opacity: 0.7,
  marginBottom: "6px",
};

const statusText = {
  fontSize: "15px",
  fontWeight: 600,
};

const encourageText = {
  fontSize: "13px",
  opacity: 0.85,
  marginTop: "4px",
};

const progressTrack = {
  height: "8px",
  background: "rgba(255,255,255,0.25)",
  borderRadius: "10px",
  overflow: "hidden",
};

const progressFill = {
  height: "100%",
  background: "#ded522",
  transition: "width 0.6s ease",
  boxShadow: "0 0 8px rgba(176, 155, 223, 0.6)",
};

const metaText = {
  marginTop: "10px",
  fontSize: "13px",
  opacity: 0.9,
};

const primaryBtn = {
  marginTop: "18px",
  width: "100%",
  padding: "12px",
  borderRadius: "14px",
  border: "none",
  background: "#b577fc",
  color: "white",
  fontWeight: 700,
  cursor: "pointer",
};

const descStyle = {
  fontSize: "13px",
  opacity: 0.7,
};

const footerText = {
  fontSize: "12px",
  opacity: 0.6,
  marginTop: "10px",
};

// import { useState } from "react";

// const ObjectModal = ({ habit, onClose, onHabitUpdated }) => {

//   if (!habit) return null;

// const statusMessages = {
//   neutral: "Let’s start building this habit 🌱",
//   active: "Great consistency! Keep going 💪",
//   flourishing: "Amazing! This habit is thriving 🚀",
//   missed: "It’s okay — today is a fresh start 🌤️",
//   abandoned: "You can restart anytime 💛",
// };

//   // const HABIT_CONFIG = {
//   //   plant: {
//   //     defaultName: "Water the Plant",
//   //     description: "Care for your plant to help it grow every day 🌱",
//   //     status: "Active",
//   //     streak: 4,
//   //     lastCompleted: "Yesterday",
//   //     progress: 60,
//   //   },
//   //   lamp: {
//   //     defaultName: "Focus Session",
//   //     description: "Turn on focus mode and work distraction‑free 💡",
//   //     status: "Neutral",
//   //     streak: 0,
//   //     lastCompleted: "Yesterday",
//   //     progress: 20,
//   //   },
//   //   window: {
//   //     defaultName: "Mindful Break",
//   //     description: "Pause and reflect for a few minutes 🌤️",
//   //     status: "Missed",
//   //     streak: 1,
//   //     lastCompleted: "Yesterday",
//   //     progress: 35,
//   //   },
//   //   bookshelf: {
//   //     defaultName: "Read Books",
//   //     description: "Read at least a few pages today 📚",
//   //     status: "Flourishing",
//   //     streak: 12,
//   //     lastCompleted: "Yesterday",
//   //     progress: 85,
//   //   },
//   // };

//   // const ENCOURAGEMENT = {
//   //   Active: "Great consistency! Keep going 🌱",
//   //   Neutral: "Let’s build this habit step by step 💪",
//   //   Missed: "It’s okay — today is a fresh start 🌤️",
//   //   Flourishing: "Amazing! This habit is thriving 🚀",
//   // };

//   // const habit = HABIT_CONFIG[object];

//   const [isEditing, setIsEditing] = useState(false);
//   const [name, setName] = useState(habit.habitName || "New Habit");

//  const saveName = async () => {
//   if (!habit?._id) {
//     console.error("Habit ID missing");
//     return;
//   }

//   try {
//     const token = localStorage.getItem("token");

//     const res = await fetch(
//       `${import.meta.env.VITE_API_URL}/api/habits/${habit._id}`,
//       {
// const ObjectModal = ({ habit, onClose }) => {
//   if (!habit) return null;

//   const statusMessages = {
//     neutral: "Let’s start building this habit 🌱",
//     active: "Great consistency! Keep going 💪",
//     flourishing: "Amazing! This habit is thriving 🚀",
//     missed: "It’s okay — today is a fresh start 🌤️",
//     abandoned: "You can restart anytime 💛",
//   };

//   const DESCRIPTIONS = {
//     plant: "Care for your plant to help it grow every day 🌱",
//     lamp: "Focus deeply and work distraction‑free 💡",
//     window: "Pause and take mindful breaks 🌤️",
//     bookshelf: "Read a little every day 📚",
//   };

//   const [isEditing, setIsEditing] = useState(false);
//   const [name, setName] = useState(habit.habitName || "");

//   const saveName = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       await fetch(`${import.meta.env.VITE_API_URL}/api/habits/${habit._id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ habitName: name }),
//       }
//     );

//     if (!res.ok) {
//       throw new Error("Failed to update habit");
//     }

//     const updatedHabit = await res.json();
//     console.log("Updated habit:", updatedHabit);

//     // 🔥 Tell parent (Room) to update UI instantly
//     onHabitUpdated(updatedHabit);

//   } catch (err) {
//     console.error("Failed to update habit name", err);
//   }
// };

// const markAsDone = async () => {
//   try {
//     const token = localStorage.getItem("token");

//     await fetch(`${import.meta.env.VITE_API_URL}/api/habits/${habit._id}/complete`, {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     window.location.reload(); // demo refresh
//   } catch (err) {
//     console.error("Failed to mark habit done", err);
//   }
// };

//   return (
//     <div style={overlayStyle} onClick={onClose}>
//       <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
//         <button style={closeBtn} onClick={onClose}>
//           ✕
//         </button>

//         {isEditing ? (
//           <input
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             style={editInput}
//             autoFocus
//           />
//         ) : (
//           <h2>{habit.habitName || "New Habit"}</h2>
//         )}

//         <p style={descStyle}>
//   {habit.type === "plant" && "Care for your plant to help it grow 🌱"}
//   {habit.type === "lamp" && "Focus and get productive 💡"}
//   {habit.type === "window" && "Take mindful breaks 🌤️"}
//   {habit.type === "bookshelf" && "Grow by learning every day 📚"}
// </p>

// <button
//   style={editBtn}
//   onClick={() => {
//     if (isEditing) saveName();
//     setIsEditing(!isEditing);
//   }}
// >   {isEditing ? "Save Name" : "Edit Habit Name"}
//         </button>

//         <div style={sectionBox}>
//   <p style={sectionTitle}>📌 Status</p>
//   <p style={statusText}>{habit.currentState}</p>
//   <p style={encourageText}>{statusMessages[habit.currentState]}</p>
// </div>

//         <div style={sectionBox}>
//           <p style={sectionTitle}>Weekly Progress</p>
//           <div style={progressTrack}>
//             <div
//               style={{
//                 ...progressFill,
//                 width: `${Math.min(habit.consecutiveDays * 10, 100)}%`,
//               }}
//             />
//           </div>
//           <div style={metaText}>
//             🔥 Streak: <strong>{habit.consecutiveDays} days</strong>
//             <br />
//             📅 Last completed: <strong>
//       {habit.lastCompletedDate
//         ? new Date(habit.lastCompletedDate).toDateString()
//         : "Not yet"}
//     </strong>
//           </div>
//         </div>

//         {/* ACTION */}
// <button style={primaryBtn} onClick={markAsDone}>
//   Mark as Done
// </button>

//         <p style={footerText}>Progress updates visually in the room.</p>
//       </div>
//     </div>
//   );
// };

// export default ObjectModal;

// const overlayStyle = {
//   position: "fixed",
//   inset: 0,
//   background: "rgba(0,0,0,0.45)",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   zIndex: 1000,
// };

// const modalStyle = {
//   width: "360px",
//   padding: "22px",
//   borderRadius: "18px",
//   background: "rgba(255,255,255,0.12)",
//   backdropFilter: "blur(16px)",
//   color: "white",
//   position: "relative",
// };

// const closeBtn = {
//   position: "absolute",
//   top: "12px",
//   right: "14px",
//   background: "none",
//   border: "none",
//   color: "white",
//   fontSize: "18px",
//   cursor: "pointer",
// };

// const editInput = {
//   width: "100%",
//   fontSize: "18px",
//   padding: "8px",
//   borderRadius: "8px",
//   border: "none",
// };

// const editBtn = {
//   marginTop: "6px",
//   background: "none",
//   border: "none",
//   color: "#b58af6",
//   cursor: "pointer",
//   fontSize: "13px",
// };

// const sectionBox = {
//   marginTop: "14px",
//   padding: "14px",
//   borderRadius: "14px",
//   background: "rgba(255,255,255,0.18)",
// };

// const sectionTitle = {
//   fontSize: "12px",
//   opacity: 0.7,
//   marginBottom: "6px",
// };

// const statusText = {
//   fontSize: "15px",
//   fontWeight: 600,
// };

// const encourageText = {
//   fontSize: "13px",
//   opacity: 0.85,
//   marginTop: "4px",
// };

// const progressTrack = {
//   height: "8px",
//   background: "rgba(255,255,255,0.25)",
//   borderRadius: "10px",
//   overflow: "hidden",
// };

// const progressFill = {
//   height: "100%",
//   background: "#cc9cff",
//   transition: "width 0.6s ease",
//   boxShadow: "0 0 8px rgba(176, 155, 223, 0.6)",
// };

// const metaText = {
//   marginTop: "10px",
//   fontSize: "13px",
//   opacity: 0.9,
// };

// const primaryBtn = {
//   marginTop: "18px",
//   width: "100%",
//   padding: "12px",
//   borderRadius: "14px",
//   border: "none",
//   background: "#b577fc",
//   color: "rgb(255, 255, 255)",
//   fontWeight: 700,
//   cursor: "pointer",
// };

// const descStyle = {
//   fontSize: "13px",
//   opacity: 0.7,
// };

// const footerText = {
//   fontSize: "12px",
//   opacity: 0.6,
//   marginTop: "10px",
// };
