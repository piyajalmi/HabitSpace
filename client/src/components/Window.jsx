import { useGLTF, Html } from "@react-three/drei";
import { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WINDOW_MODELS } from "../utils/modelMap";
import { ROOM_STATE_CONFIG } from "../utils/roomState";

const WindowModel = ({ roomState, habit, onClick }) => {
  const windowState = ROOM_STATE_CONFIG[roomState]?.window;
  const path = WINDOW_MODELS[windowState];
  if (!path) return null;

  const { scene } = useGLTF(path);

  const modelRef = useRef();
  const [hovered, setHovered] = useState(false);

  // 🌊 Subtle pulse on hover
  useFrame(({ clock }) => {
    if (!modelRef.current) return;

    if (hovered) {
      const pulse = 1 + Math.sin(clock.elapsedTime * 2) * 0.02;
      modelRef.current.scale.set(pulse, pulse, pulse);
    } else {
      modelRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  // ✨ Soft glow
  scene.traverse((child) => {
    if (child.isMesh) {
      child.material.emissive = new THREE.Color("#bfe9ff");
      child.material.emissiveIntensity = hovered ? 0.18 : 0;
    }
  });

  const defaultHabitName = "Take a mindful break 🌤️";
  const habitName =
    habit && habit.habitName && habit.habitName.trim() !== ""
      ? habit.habitName
      : defaultHabitName;

  return (
    <group
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
        onClick?.("window");
      }}
    >
      {/* 🪟 SPEECH BUBBLE */}
      <Html
        position={[-2, 1, 0]} // 👈 slightly higher than plant
        center
        occlude={false}
        pointerEvents="none"
      >
        <div className="plant-label">{habitName}</div>
      </Html>

      {/* 🪟 Window model */}
      <primitive ref={modelRef} object={scene} />
    </group>
  );
};

export default WindowModel;
