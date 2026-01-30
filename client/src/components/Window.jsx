// import { useGLTF } from "@react-three/drei";
// import { WINDOW_MODELS } from "../utils/modelMap";
// import { ROOM_STATE_CONFIG } from "../utils/roomState";

// const WindowModel = ({ roomState }) => {
//   const windowState = ROOM_STATE_CONFIG[roomState]?.window;
//   const path = WINDOW_MODELS[windowState];
//   if (!path) return null;

//   const { scene } = useGLTF(path);
//   return <primitive object={scene} position={[0, -0.45, 0]} />;
// };

// export default WindowModel;

import { useGLTF } from "@react-three/drei";
import { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { WINDOW_MODELS } from "../utils/modelMap";
import { ROOM_STATE_CONFIG } from "../utils/roomState";

const WindowModel = ({ roomState, onClick }) => {
  const windowState = ROOM_STATE_CONFIG[roomState]?.window;
  const path = WINDOW_MODELS[windowState];
  if (!path) return null;

  const { scene } = useGLTF(path);

  const modelRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!modelRef.current) return;

    if (hovered) {
      const pulse = 1 + Math.sin(clock.elapsedTime * 2) * 0.02;
      modelRef.current.scale.set(pulse, pulse, pulse);
    } else {
      modelRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
    }
  });

  scene.traverse((child) => {
    if (child.isMesh) {
      child.material.emissive = new THREE.Color("#bfe9ff"); // warm soft glow
      child.material.emissiveIntensity = hovered ? 0.18 : 0;
    }
  });

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
      <primitive ref={modelRef} object={scene} />
    </group>
  );
};

export default WindowModel;
