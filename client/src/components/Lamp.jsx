import { useGLTF } from "@react-three/drei";
import { useState, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { LAMP_MODELS } from "../utils/modelMap";
import { ROOM_STATE_CONFIG } from "../utils/roomState";

const Lamp = ({ roomState, onClick }) => {
  const lampState = ROOM_STATE_CONFIG[roomState]?.lamp;
  const path = LAMP_MODELS[lampState];
  if (!path) return null;

  const { scene } = useGLTF(path);
  const modelRef = useRef();
  const lightRef = useRef();
  const [hovered, setHovered] = useState(false);

  // 🔆 Light strength by state (used ONLY on hover)
  const STATE_LIGHT = {
    0: 0.0, // abandoned
    1: 0.4, // missed
    2: 0.8, // neutral
    3: 1.4, // active
    4: 2.2, // flourishing
  };

  // 🎨 Prepare emissive ONCE (OFF by default)
  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh || !child.material) return;

      const mats = Array.isArray(child.material)
        ? child.material
        : [child.material];

      mats.forEach((mat) => {
        mat.emissive = new THREE.Color("#ffd27d");
        mat.emissiveIntensity = 0; // ❗ OFF initially
        mat.needsUpdate = true;
      });
    });
  }, [scene]);

  // ✨ Hover animation + glow
  useFrame(({ clock }) => {
    // 🔆 Point light
    if (lightRef.current) {
      lightRef.current.intensity = hovered
        ? (STATE_LIGHT[roomState] ?? 0.8)
        : 0;
    }

    // 🔥 Emissive glow
    scene.traverse((child) => {
      if (!child.isMesh || !child.material) return;

      const mats = Array.isArray(child.material)
        ? child.material
        : [child.material];

      mats.forEach((mat) => {
        mat.emissiveIntensity = hovered ? 0.25 : 0;
      });
    });

    // 🌊 Subtle pulse
    if (modelRef.current) {
      if (hovered) {
        const pulse = 1 + Math.sin(clock.elapsedTime * 2) * 0.025;
        modelRef.current.scale.set(pulse, pulse, pulse);
      } else {
        modelRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.12);
      }
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
        onClick?.("lamp");
      }}
    >
      {/* 🪔 Lamp Model */}
      <primitive ref={modelRef} object={scene} />

      {/* 💡 Light — ONLY visible on hover */}
      <pointLight
        ref={lightRef}
        position={[0, 1.65, 0]}
        distance={2.8}
        decay={2}
        intensity={0} // ❗ stays off unless hovered
        color="#fff2cc"
      />
    </group>
  );
};

export default Lamp;

// import { useGLTF } from "@react-three/drei";
// import { useState, useRef } from "react";
// import { useFrame } from "@react-three/fiber";
// import * as THREE from "three";
// import { LAMP_MODELS } from "../utils/modelMap";
// import { ROOM_STATE_CONFIG } from "../utils/roomState";

// const Lamp = ({ roomState, onClick }) => {
//   const lampState = ROOM_STATE_CONFIG[roomState]?.lamp;
//   const path = LAMP_MODELS[lampState];
//   if (!path) return null;

//   const { scene } = useGLTF(path);

//   const modelRef = useRef();
//   const [hovered, setHovered] = useState(false);

// useFrame(({ clock }) => {
//   if (!modelRef.current) return;

//   if (hovered) {
//     const pulse = 1 + Math.sin(clock.elapsedTime * 2) * 0.03;
//     modelRef.current.scale.set(pulse, pulse, pulse);
//   } else {
//     modelRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
//   }
// });

//   const STATE_GLOW = {
//     0: 0.0, // abandoned
//     1: 0.05, // missed
//     2: 0.1, // neutral
//     3: 0.25, // active
//     4: 0.45, // flourishing
//   };

// scene.traverse((child) => {
//   if (child.isMesh && child.material) {
//     child.material.emissive = new THREE.Color("#ffdca8");

//     const baseGlow = STATE_GLOW[roomState] ?? 0.1;

//     child.material.emissiveIntensity = hovered ? baseGlow + 0.15 : baseGlow;
//   }
// });

//   useEffect(() => {
//     scene.traverse((child) => {
//       if (child.isMesh && child.name.toLowerCase().includes("shade")) {
//         child.material.emissive = new THREE.Color("#fff2cc");
//         child.material.emissiveIntensity = 0.6;
//       }
//     });
//   }, [scene]);

//   console.log(child.name);

//   return (
//     <group
//       position={[0, -0.45, 0]}
//       onPointerOver={(e) => {
//         e.stopPropagation();
//         setHovered(true);
//         document.body.style.cursor = "pointer";
//       }}
//       onPointerOut={() => {
//         setHovered(false);
//         document.body.style.cursor = "default";
//       }}
//       onPointerDown={(e) => {
//         e.stopPropagation();
//         onClick?.("lamp");
//       }}
//     >
//       <primitive ref={modelRef} object={scene} />
//     </group>
//   );
// };

// export default Lamp;

// // import { useGLTF } from "@react-three/drei";
// // import { LAMP_MODELS } from "../utils/modelMap";
// // import { ROOM_STATE_CONFIG } from "../utils/roomState";

// // const Lamp = ({ roomState }) => {
// //   const lampState = ROOM_STATE_CONFIG[roomState]?.lamp;
// //   const path = LAMP_MODELS[lampState];
// //   if (!path) return null;

// //   const { scene } = useGLTF(path);
// //   return <primitive object={scene} position={[0, -0.45, 0]} />;
// // };

// // export default Lamp;
