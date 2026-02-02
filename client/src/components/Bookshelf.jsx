import { useGLTF, Html } from "@react-three/drei";
import { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BOOKSHELF_MODELS } from "../utils/modelMap";
import { ROOM_STATE_CONFIG } from "../utils/roomState";

const Bookshelf = ({ roomState, habit, onClick }) => {
  const shelfState = ROOM_STATE_CONFIG[roomState]?.bookshelf;
  const path = BOOKSHELF_MODELS[shelfState];
  if (!path) return null;

  const { scene } = useGLTF(path);
  const modelRef = useRef();
  const [hovered, setHovered] = useState(false);

  // 📚 Pulse animation
  useFrame(({ clock }) => {
    if (!modelRef.current) return;

    if (hovered) {
      const pulse = 1 + Math.sin(clock.elapsedTime * 2) * 0.025;
      modelRef.current.scale.set(pulse, pulse, pulse);
    } else {
      modelRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  // ✨ Glow on hover
  scene.traverse((child) => {
    if (child.isMesh) {
      child.material.emissive = new THREE.Color("#f5deb3");
      child.material.emissiveIntensity = hovered ? 0.15 : 0;
    }
  });

  const defaultHabitName = "Hobbies ✨";

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
        onClick?.("bookshelf");
      }}
    >
      {/* 📚 Speech Bubble */}
      <Html
        position={[1, 1.8, 0]}
        center
        occlude={false}
        pointerEvents="none"
        style={{ pointerEvents: "none" }}
      >
        <div className="plant-label">{habitName}</div>
      </Html>

      <primitive ref={modelRef} object={scene} />
    </group>
  );
};

export default Bookshelf;
