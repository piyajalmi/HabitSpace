import { useGLTF } from "@react-three/drei";
import { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PLANT_MODELS } from "../utils/modelMap";
import { ROOM_STATE_CONFIG } from "../utils/roomState";
import { Html } from "@react-three/drei";
import { useEffect } from "react";

const Plant = ({ roomState, habit, onClick }) => {
  const plantState = ROOM_STATE_CONFIG[roomState]?.plant;
  const path = PLANT_MODELS[plantState];
  if (!path) return null;

  const { scene } = useGLTF(path);
  const clonedScene = scene.clone(true);

  const groupRef = useRef();
  const modelRef = useRef();

  const [hovered, setHovered] = useState(false);

  // 🌱 Gentle pulse animation
  useFrame(({ clock }) => {
    if (!modelRef.current) return;

    if (hovered) {
      const pulse = 1 + Math.sin(clock.elapsedTime * 2) * 0.03;
      modelRef.current.scale.set(pulse, pulse, pulse);
    } else {
      modelRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  // ✨ Glow on hover
  scene.traverse((child) => {
    if (child.isMesh) {
      child.material.emissive = new THREE.Color("#9cff9c"); // soft green
      child.material.emissiveIntensity = hovered ? 0.15 : 0;
    }
  });

  const defaultHabitName = "Drink 2L Water 💧";

  const habitName =
    habit && habit.habitName && habit.habitName.trim() !== ""
      ? habit.habitName
      : defaultHabitName;

  return (
    <group
      ref={groupRef}
      position={[0, -0.45, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "default";
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onClick("plant");
      }}
    >
      {/* 🌱 SPEECH BUBBLE (ALWAYS VISIBLE) */}
      <Html
        position={[-0.35, 1.95, 0]}
        center
        occlude={false}
        pointerEvents="none"
        style={{ pointerEvents: "none" }}
      >
        <div className="plant-label">{habitName}</div>
      </Html>

      {/* 🌿 Plant model */}
      <primitive ref={modelRef} object={clonedScene} />
    </group>
  );
};

export default Plant;

const labelStyle = {
  padding: "6px 14px",
  borderRadius: "999px",
  background: "rgba(30, 30, 40, 0.85)",
  color: "white",
  fontSize: "12px",
  fontWeight: 600,
  whiteSpace: "nowrap",
  backdropFilter: "blur(8px)",
  WebkitBackdropFilter: "blur(8px)",
  boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
};
