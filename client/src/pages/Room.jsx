import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useRef, useEffect, useState } from "react";
import RoomModel from "../components/RoomModel";
import * as THREE from "three";
import WelcomeToast from "../components/WelcomeToast";
import Plant from "../components/Plant";
import Lamp from "../components/Lamp";
import WindowModel from "../components/Window";
import Bookshelf from "../components/Bookshelf";
import SceneBackground from "../components/SceneBackground";
import { getObjectState } from "../utils/objectStateCalculator";
import { useNavigate } from "react-router-dom";
import ObjectModal from "../components/ObjectModal";
import FloatingMenu from "../components/FloatingMenu";
import ProgressModal from "../components/ProgressModal";
import GuideModal from "../components/GuideModal";
import ConfirmDialog from "../components/ConfirmDialog";
import HistoryTimeline from "../components/HistoryTimeline";
import NotificationBell from "../components/NotificationBell";


const Room = () => {
  const roomState = 0;
  const userName = localStorage.getItem("userName") || "Friend";
  const navigate = useNavigate();

  const lampMainRef = useRef();
  const bulbCoreRef = useRef();
  const frozenStatesRef = useRef(null); //pause feature

  const [selectedHabit, setSelectedHabit] = useState(null);
  const [habits, setHabits] = useState([]);
  const [showProgress, setShowProgress] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [lastHabitsSnapshot, setLastHabitsSnapshot] = useState(null);
  const [showUndo, setShowUndo] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState(null);
  const handleRequestConfirm = (type) => {
    if (type === "pause") {
      setConfirmConfig({
        title: isPaused ? "Resume Habits?" : "Pause Habits?",
        message: isPaused
          ? "Your habits will start tracking again."
          : "Progress tracking will be temporarily frozen.",
        confirmText: isPaused ? "Resume" : "Pause",
        onConfirm: () => {
          togglePause();
          setConfirmConfig(null);
        },
        onCancel: () => setConfirmConfig(null),
      });
    }

    if (type === "reset") {
      setConfirmConfig({
        title: "Reset All Progress?",
        message:
          "This will erase ALL your habit progress. This action cannot be undone.",
        confirmText: "Reset",
        danger: true,
        onConfirm: async () => {
          await resetRoom();
          setConfirmConfig(null);
        },
        onCancel: () => setConfirmConfig(null),
      });
    }

    if (type === "logout") {
      setConfirmConfig({
        title: "Logout?",
        message: "You will need to log in again to access your room.",
        confirmText: "Logout",
        onConfirm: () => {
          localStorage.removeItem("token");
          localStorage.removeItem("userName");
          navigate("/", { replace: true });
        },
        onCancel: () => setConfirmConfig(null),
      });
    }
  };
  const defaultHabitNames = {
    plant: "Drink 2LWater Daily 💧",
    lamp: "Meditation 💡",
    window: "Exposure to Sunlight for 10mins 🌤️",
    bookshelf: "Everyday Journaling 📚",
  };

  // const lampMainIntensity = [0.15, 0.3, 0.55, 0.85, 1.1];
  // const bulbCoreIntensity = [0.02, 0.05, 0.08, 0.12, 0.18];
  const lampMainIntensity = [0.3, 0.5, 0.8, 1.2, 1.6];
  const bulbCoreIntensity = [0.05, 0.1, 0.18, 0.28, 0.4];

  const handleObjectClick = (objectType) => {
    const habit = habits.find((h) => h.type === objectType);

    setSelectedHabit(
      habit || {
        type: objectType,
        habitName: defaultHabitNames[objectType],
        currentState: "neutral",
        consecutiveDays: 0,
        lastCompletedDate: null,
        _id: null,
      },
    );
  };

  const closeModal = () => setSelectedHabit(null);

  const togglePause = () => {
    //pause feature
    setIsPaused((prev) => {
      if (!prev) {
        frozenStatesRef.current = {
          plant: getObjectState(plantHabit),
          lamp: getObjectState(lampHabit),
          window: getObjectState(windowHabit),
          bookshelf: getObjectState(bookshelfHabit),
        };
      }
      return !prev;
    });
  };
  const requestPauseToggle = () => {
    setConfirmConfig({
      title: isPaused ? "Resume Habits?" : "Pause Habits?",
      message: isPaused
        ? "Your habits will start tracking again."
        : "Progress tracking will be temporarily frozen.",
      confirmText: isPaused ? "Resume" : "Pause",
      onConfirm: () => {
        togglePause();
        setConfirmConfig(null);
      },
      onCancel: () => setConfirmConfig(null),
    });
  };

  const resetRoom = async () => {
    try {
      const token = localStorage.getItem("token");

      // 🧠 Save current habits BEFORE reset
      setLastHabitsSnapshot(habits);

      await fetch(`${import.meta.env.VITE_API_URL}/api/habits/reset/all`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh habits from server
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/habits/my-habits`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
      setHabits(Array.isArray(data) ? data : []);

      // ✨ Show Undo option
      setShowUndo(true);

      // Auto hide undo after 8 seconds
      setTimeout(() => setShowUndo(false), 8000);
    } catch (err) {
      console.error("Reset failed", err);
    }
  };
  const undoReset = async () => {
    if (!lastHabitsSnapshot) return;

    try {
      const token = localStorage.getItem("token");

      // Restore each habit
      for (const habit of lastHabitsSnapshot) {
        await fetch(`${import.meta.env.VITE_API_URL}/api/habits/${habit._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            consecutiveDays: habit.consecutiveDays,
            lastCompletedDate: habit.lastCompletedDate,
            currentState: habit.currentState,
          }),
        });
      }

      setHabits(lastHabitsSnapshot);
      setShowUndo(false);
    } catch (err) {
      console.error("Undo failed", err);
    }
  };

  const requestResetRoom = () => {
    setConfirmConfig({
      title: "Reset All Progress?",
      message:
        "This will erase ALL your habit progress. This action cannot be undone.",
      confirmText: "Reset",
      danger: true,
      onConfirm: () => {
        resetRoom();
        setConfirmConfig(null);
      },
      onCancel: () => setConfirmConfig(null),
    });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, []);

  useEffect(() => {
    document.title = "HabitSpace";
  }, []);

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/habits/my-habits`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        setHabits(Array.isArray(data) ? data : []);
      } catch {
        setHabits([]);
      }
    };
    fetchHabits();
  }, []);

  const plantHabit = habits.find((h) => h.type === "plant");
  const lampHabit = habits.find((h) => h.type === "lamp");
  const windowHabit = habits.find((h) => h.type === "window");
  const bookshelfHabit = habits.find((h) => h.type === "bookshelf");

  const plantState =
    isPaused && frozenStatesRef.current
      ? frozenStatesRef.current.plant
      : getObjectState(plantHabit);
  const lampState =
    isPaused && frozenStatesRef.current
      ? frozenStatesRef.current.lamp
      : getObjectState(lampHabit);
  const windowState =
    isPaused && frozenStatesRef.current
      ? frozenStatesRef.current.window
      : getObjectState(windowHabit);
  const bookshelfState =
    isPaused && frozenStatesRef.current
      ? frozenStatesRef.current.bookshelf
      : getObjectState(bookshelfHabit);

  useEffect(() => {
    if (lampMainRef.current) {
      lampMainRef.current.intensity = lampMainIntensity[lampState ?? 2];
    }

    if (bulbCoreRef.current) {
      bulbCoreRef.current.intensity = bulbCoreIntensity[lampState ?? 2];
    }
  }, [lampState]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <WelcomeToast userName={userName} roomState={roomState} />
      <Canvas
        camera={{ position: [1.5, 1.1, 2.5], fov: 50, rotation: [0, 0.65, 0] }}
        gl={{
          physicallyCorrectLights: true,
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.7,
        }}
      >
        <SceneBackground />

        <RoomModel />
        <Plant
          roomState={plantState}
          habit={plantHabit}
          onClick={handleObjectClick}
        />

        <Lamp
          roomState={lampState}
          habit={lampHabit}
          onClick={handleObjectClick}
        />

        <WindowModel
          roomState={windowState}
          habit={windowHabit}
          onClick={handleObjectClick}
        />

        <Bookshelf
          roomState={bookshelfState}
          habit={bookshelfHabit}
          onClick={handleObjectClick}
        />

        <EffectComposer>
          <Bloom
            intensity={0.15}
            luminanceThreshold={0.9}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>

        <ambientLight intensity={0.25} />
        <directionalLight position={[2, 4, 2]} intensity={0.9} />
        <directionalLight position={[-1, 2, 2]} intensity={0.35} />
        <pointLight
          ref={lampMainRef}
          position={[-1.2, 1.6, 0.8]}
          distance={2.3}
          decay={2}
          color="#ffd9a6"
        />
        <pointLight
          ref={bulbCoreRef}
          position={[-0.85, 1.75, 0.95]}
          distance={0.6}
          decay={2}
          color="#ffdca8"
        />
      </Canvas>

<NotificationBell />
      {/* <FloatingMenu
         onPauseToggle={requestPauseToggle}
  isPaused={isPaused}
  onReset={requestResetRoom}
        onProgress={() => setShowProgress(true)}
        onGuide={() => setShowGuide(true)}
      /> */}
      <FloatingMenu
        isPaused={isPaused}
        onProgress={() => setShowProgress(true)}
        onGuide={() => setShowGuide(true)}
        onRequestConfirm={handleRequestConfirm}
        onHistory={() => setShowHistory(true)}
      />
      {showHistory && <HistoryTimeline onClose={() => setShowHistory(false)} />}

      {/* //pause feature */}
      {isPaused && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "10px 18px",
            borderRadius: "12px",
            background: "rgba(0,0,0,0.6)",
            color: "white",
            fontSize: "14px",
            zIndex: 3000,
          }}
        >
          ⏸ Habits Paused
        </div>
      )}

      {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}
      {showProgress && (
        <ProgressModal onClose={() => setShowProgress(false)} habits={habits} />
      )}

      {selectedHabit && (
        <ObjectModal
          habit={selectedHabit}
          isPaused={isPaused}
          onClose={closeModal}
          onHabitUpdated={(updatedHabit) => {
            // ✅ Update habits list (room visuals)
            setHabits((prev) =>
              prev.map((h) => (h._id === updatedHabit._id ? updatedHabit : h)),
            );

            // ✅ ALSO update the modal's habit
            setSelectedHabit(updatedHabit);
          }}
        />
      )}
      {confirmConfig && (
        <ConfirmDialog
          title={confirmConfig.title}
          message={confirmConfig.message}
          confirmText={confirmConfig.confirmText}
          danger={confirmConfig.danger}
          onConfirm={confirmConfig.onConfirm}
          onCancel={confirmConfig.onCancel}
        />
      )}
      {showUndo && (
        <div style={undoToast}>
          Room reset.
          <button onClick={undoReset} style={undoBtn}>
            Undo
          </button>
        </div>
      )}
    </div>
  );
};
const undoToast = {
  position: "fixed",
  bottom: "30px",
  left: "50%",
  transform: "translateX(-50%)",
  background: "rgba(20,20,30,0.95)",
  color: "white",
  padding: "12px 18px",
  borderRadius: "14px",
  display: "flex",
  gap: "12px",
  alignItems: "center",
  boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  zIndex: 6000,
  fontSize: "14px",
};

const undoBtn = {
  border: "none",
  padding: "6px 12px",
  borderRadius: "8px",
  background: "linear-gradient(135deg,#ff9966,#ff5e62)",
  color: "white",
  cursor: "pointer",
};

export default Room;

// import { Canvas } from "@react-three/fiber";
// import { EffectComposer, Bloom } from "@react-three/postprocessing";
// import { useRef, useEffect } from "react";
// import RoomModel from "../components/RoomModel";
// import * as THREE from "three";
// import WelcomeToast from "../components/WelcomeToast";
// import Plant from "../components/Plant";
// import Lamp from "../components/Lamp";
// import WindowModel from "../components/Window";
// import Bookshelf from "../components/Bookshelf";
// import SceneBackground from "../components/SceneBackground";
// import { getObjectState } from "../utils/objectStateCalculator";
// import { useNavigate } from "react-router-dom";

// //modal/overlay
// import { useState } from "react";
// import ObjectModal from "../components/ObjectModal";
// //Floating button
// import FloatingMenu from "../components/FloatingMenu";
// import ProgressModal from "../components/ProgressModal";
// import GuideModal from "../components/GuideModal";

// const Room = () => {
//   // 🔒 TEMP manual testing (0–4)
//   const roomState = 0;
//   const userName = localStorage.getItem("userName") || "Friend";
//   const navigate = useNavigate();

//   // 🔦 Light refs
//   const lampMainRef = useRef();
//   const bulbCoreRef = useRef();

//   // 🔆 Light intensity maps
//   const lampMainIntensity = [0.15, 0.3, 0.55, 0.85, 1.1];
//   const bulbCoreIntensity = [0.02, 0.05, 0.08, 0.12, 0.18];

//   // removeable OBJECT CLICKING AND HOVERING AND OVERLAY APPEARING
//   const [selectedHabit, setSelectedHabit] = useState(null);
//   const [habits, setHabits] = useState([]);

//   // ✅ SINGLE click handler (this is the only one)
//   const handleObjectClick = (objectType) => {
//     console.log("CLICKED:", objectType);

//     const habit = habits.find((h) => h.type === objectType);

//     setSelectedHabit(
//       habit || {
//         type: objectType,
//         habitName: "New Habit",
//         currentState: "neutral",
//         consecutiveDays: 0,
//         lastCompletedDate: null,
//         _id: null, // placeholder
//       },
//     );
//   };

//   const closeModal = () => {
//     setSelectedHabit(null);
//   };

//   const frozenStatesRef = useRef(null);

//   const togglePause = () => {
//     setIsPaused((prev) => {
//       if (!prev) {
//         frozenStatesRef.current = {
//           plant: getObjectState(plantHabit),
//           lamp: getObjectState(lampHabit),
//           window: getObjectState(windowHabit),
//           bookshelf: getObjectState(bookshelfHabit),
//         };
//       }
//       return !prev;
//     });
//   };

//   const resetRoom = async () => {
//   try {
//     const token = localStorage.getItem("token");

//     await fetch(`${import.meta.env.VITE_API_URL}/api/habits/reset/all`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     window.location.reload(); // refresh visuals after reset
//   } catch (err) {
//     console.error("Reset failed", err);
//   }
// };

//   useEffect(() => {
//     console.log("Selected habit:", selectedHabit);
//   }, [selectedHabit]);

//   const [showProgress, setShowProgress] = useState(false);
//   const [showGuide, setShowGuide] = useState(false);
//   const [resetVersion, setResetVersion] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);

//   useEffect(() => {
//     //this is used for loggin out button in FAB
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/");
//     }
//   }, []);

//   //removeable testing

//   useEffect(() => {
//     const checkUser = async () => {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         navigate("/auth"); //check this again
//         return;
//       }

//       const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();

//       if (!data.isVerified) {
//         alert("Please verify your email first");
//         navigate("/auth");
//       }
//     };

//     checkUser();
//   }, []);

//   useEffect(() => {
//   const fetchHabits = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch(
//         `${import.meta.env.VITE_API_URL}/api/habits/my-habits`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       const data = await res.json();

//       // 🛑 If backend sends error object instead of array
//       if (!Array.isArray(data)) {
//         console.error("Habits API error:", data);
//         setHabits([]); // prevent crash
//         return;
//       }

//       setHabits(data);
//     } catch (err) {
//       console.error("Failed to fetch habits", err);
//       setHabits([]); // prevent crash
//     }
//   };

//   fetchHabits();
// }, []);

//   //testing to see habits from backend
//   useEffect(() => {
//     console.log("HABITS FROM BACKEND:", habits);
//   }, [habits]);

//   // 🔄 Apply state → lighting
//   useEffect(() => {
//     if (lampMainRef.current) {
//       lampMainRef.current.intensity = lampMainIntensity[roomState];
//     }

//     if (bulbCoreRef.current) {
//       bulbCoreRef.current.intensity = bulbCoreIntensity[roomState];
//     }
//   }, [roomState]);
// useEffect(() => {
//   console.log("Selected object:", selectedObject);
//   console.log("Matched habit:", selectedHabit);
// }, [selectedObject]);
//   // 🔄 Assign habits to room objects
//   const plantHabit = habits.find((h) => h.type === "plant");
//   const lampHabit = habits.find((h) => h.type === "lamp");
//   const windowHabit = habits.find((h) => h.type === "window");
//   const bookshelfHabit = habits.find((h) => h.type === "bookshelf");

// // const selectedHabit = selectedObject
// //   ? habits.find((h) => h.type === selectedObject)
// //   : null;

//   // Convert habit → visual state (0–4)
//   // const plantState = getObjectState(plantHabit);
//   // const lampState = getObjectState(lampHabit);
//   // const windowState = getObjectState(windowHabit);
//   // const bookshelfState = getObjectState(bookshelfHabit);

//   const plantState =
//     resetVersion > 0
//       ? 2
//       : isPaused && frozenStatesRef.current
//         ? frozenStatesRef.current.plant
//         : getObjectState(plantHabit);

//   const lampState =
//     resetVersion > 0
//       ? 2
//       : isPaused && frozenStatesRef.current
//         ? frozenStatesRef.current.lamp
//         : getObjectState(lampHabit);

//   const windowState =
//     resetVersion > 0
//       ? 2
//       : isPaused && frozenStatesRef.current
//         ? frozenStatesRef.current.window
//         : getObjectState(windowHabit);

//   const bookshelfState =
//     resetVersion > 0
//       ? 2
//       : isPaused && frozenStatesRef.current
//         ? frozenStatesRef.current.bookshelf
//         : getObjectState(bookshelfHabit);

//   //not the final above

//   return (
//     <div style={{ width: "100vw", height: "100vh" }}>
//       <WelcomeToast userName={userName} roomState={roomState} />
//       <Canvas
//         /* ❗ CAMERA SETTINGS — UNTOUCHED */
//         camera={{
//           position: [1.5, 1.1, 2.5],
//           fov: 50,
//           rotation: [0, 0.65, 0],
//         }}
//         gl={{
//           physicallyCorrectLights: true,
//           outputColorSpace: THREE.SRGBColorSpace,
//           toneMapping: THREE.ACESFilmicToneMapping,
//           toneMappingExposure: 0.7,
//         }}
//         style={{ width: "100%", height: "100%", display: "block" }}
//       >
//         <SceneBackground roomState={roomState} />
//         <RoomModel />
//         {/* <Plant roomState={roomState} onClick={handleObjectClick} /> */}

//         <Plant roomState={plantState} onClick={handleObjectClick} />
//         <Lamp roomState={lampState} onClick={handleObjectClick} />
//         <WindowModel roomState={windowState} onClick={handleObjectClick} />
//         <Bookshelf roomState={bookshelfState} onClick={handleObjectClick} />

//         {/* <Plant roomState={roomState} /> original piece if anything goes wrong update this*/}
//         {/* <Lamp roomState={roomState} />
//         <WindowModel roomState={roomState} />
//         <Bookshelf roomState={roomState} /> */}
//         {/* 🌈 Postprocessing */}
//         <EffectComposer>
//           <Bloom
//             intensity={0.15}
//             luminanceThreshold={0.9}
//             luminanceSmoothing={0.9}
//           />
//         </EffectComposer>

//         <ambientLight intensity={0.25} />
//         <directionalLight position={[2, 4, 2]} intensity={0.9} />
//         <directionalLight position={[-1, 2, 2]} intensity={0.35} />

//         <pointLight
//           ref={lampMainRef}
//           position={[-1.2, 1.6, 0.8]}
//           distance={2.3}
//           decay={2}
//           color="#ffd9a6"
//         />

//         <pointLight
//           ref={bulbCoreRef}
//           position={[-0.85, 1.75, 0.95]}
//           distance={0.6}
//           decay={2}
//           color="#ffdca8"
//         />

//         <pointLight position={[0.5, 1.2, 0]} intensity={0.25} />

//         {/* 🧱 Base room only */}
//       </Canvas>
//       <FloatingMenu
//         onPauseToggle={togglePause}
//         isPaused={isPaused}
//         onReset={resetRoom}
//         onProgress={() => setShowProgress(true)}
//         onGuide={() => setShowGuide(true)}
//       />

//       {isPaused && (
//         <div
//           style={{
//             position: "fixed",
//             top: 20,
//             left: "50%",
//             transform: "translateX(-50%)",
//             padding: "8px 16px",
//             borderRadius: "12px",
//             background: "rgba(0,0,0,0.6)",
//             color: "white",
//             fontSize: "14px",
//             zIndex: 3000,
//           }}
//         >
//           ⏸ Habits Paused
//         </div>
//       )}

//       {/* guideModel */}
//       {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}

//       {/* 🔽 Progress Modal (HERE) */}
//       {showProgress && <ProgressModal onClose={() => setShowProgress(false)} />}

//       {/* MODAL OVERLAY AFTER CLICKING */}
//     {selectedHabit && (
//   <ObjectModal
//     habit={selectedHabit}
//     onClose={closeModal}
//     onHabitUpdated={(updatedHabit) => {
//       setHabits((prev) =>
//         prev.map((h) => (h._id === updatedHabit._id ? updatedHabit : h))
//       );
//       setSelectedObject(updatedHabit.type); // keep modal consistent
//     }}
//   />
// )}

//     </div>
//   );
// };

// export default Room;
