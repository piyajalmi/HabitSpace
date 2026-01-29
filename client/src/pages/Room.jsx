import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";

import RoomModel from "../components/RoomModel";
import WelcomeToast from "../components/WelcomeToast";
import Plant from "../components/Plant";
import Lamp from "../components/Lamp";
import WindowModel from "../components/Window";
import Bookshelf from "../components/Bookshelf";
import SceneBackground from "../components/SceneBackground";
import ObjectModal from "../components/ObjectModal";

import { getObjectState } from "../utils/objectStateCalculator";

const Room = () => {
  const roomState = 3;
  const userName = localStorage.getItem("userName") || "Friend";
  const navigate = useNavigate();

  const lampMainRef = useRef();
  const bulbCoreRef = useRef();

  const lampMainIntensity = [0.15, 0.3, 0.55, 0.85, 1.1];
  const bulbCoreIntensity = [0.02, 0.05, 0.08, 0.12, 0.18];

  // ✅ SINGLE SOURCE OF TRUTH
  const [habits, setHabits] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);

  const handleObjectClick = (object) => {
    setSelectedObject(object);
  };

  const closeModal = () => {
    setSelectedObject(null);
  };

  // ✅ AUTH CHECK
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!data.isVerified) {
        alert("Please verify your email first");
        navigate("/");
      }
    };

    checkUser();
  }, []);

  // ✅ SINGLE fetchHabits FUNCTION
  const fetchHabits = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/habits/my-habits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setHabits(data);
    } catch (err) {
      console.error("Failed to fetch habits", err);
    }
  };

  // ✅ FETCH ON LOAD
  useEffect(() => {
    fetchHabits();
  }, []);

  // 🔄 LIGHTING
  useEffect(() => {
    if (lampMainRef.current) {
      lampMainRef.current.intensity = lampMainIntensity[roomState];
    }
    if (bulbCoreRef.current) {
      bulbCoreRef.current.intensity = bulbCoreIntensity[roomState];
    }
  }, [roomState]);

  // 🔄 MAP HABITS TO OBJECTS
  const plantHabit = habits.find((h) => h.type === "plant");
  const lampHabit = habits.find((h) => h.type === "lamp");
  const windowHabit = habits.find((h) => h.type === "window");
  const bookshelfHabit = habits.find((h) => h.type === "bookshelf");

  const plantState = getObjectState(plantHabit);
  const lampState = getObjectState(lampHabit);
  const windowState = getObjectState(windowHabit);
  const bookshelfState = getObjectState(bookshelfHabit);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <WelcomeToast userName={userName} roomState={roomState} />

      <Canvas
        camera={{
          position: [1.5, 1.1, 2.5],
          fov: 50,
          rotation: [0, 0.65, 0],
        }}
        gl={{
          physicallyCorrectLights: true,
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.7,
        }}
      >
        <SceneBackground roomState={roomState} />
        <RoomModel />

        <Plant roomState={plantState} onClick={handleObjectClick} />
        <Lamp roomState={lampState} onClick={handleObjectClick} />
        <WindowModel roomState={windowState} onClick={handleObjectClick} />
        <Bookshelf roomState={bookshelfState} onClick={handleObjectClick} />

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
      </Canvas>

      {selectedObject && (
        <ObjectModal
          object={selectedObject}
          onClose={closeModal}
          onHabitLogged={fetchHabits}
        />
      )}
    </div>
  );
};

export default Room;
