import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useRef, useEffect } from "react";
import RoomModel from "../components/RoomModel";
import * as THREE from "three";
import WelcomeToast from "../components/WelcomeToast";
import Plant from "../components/Plant";
import Lamp from "../components/Lamp";
import WindowModel from "../components/Window";
import Bookshelf from "../components/Bookshelf";
import SceneBackground from "../components/SceneBackground";
//modal/overlay
import { useState } from "react";
import ObjectModal from "../components/ObjectModal";

const Room = () => {
  // 🔒 TEMP manual testing (0–4)
  const roomState = 0;
  const userName = localStorage.getItem("userName") || "Friend";

  // 🔦 Light refs
  const lampMainRef = useRef();
  const bulbCoreRef = useRef();

  // 🔆 Light intensity maps
  const lampMainIntensity = [0.15, 0.3, 0.55, 0.85, 1.1];
  const bulbCoreIntensity = [0.02, 0.05, 0.08, 0.12, 0.18];

  // removeable OBJECT CLICKING AND HOVERING AND OVERLAY APPEARING
  const [selectedObject, setSelectedObject] = useState(null);

  // ✅ SINGLE click handler (this is the only one)
  const handleObjectClick = (object) => {
    setSelectedObject(object); // "plant" | "lamp" | "window" | "bookshelf"
  };

  const closeModal = () => {
    setSelectedObject(null);
  };

  //removeable testing

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/auth");
        return;
      }

      const res = await fetch("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!data.isVerified) {
        alert("Please verify your email first");
        navigate("/auth");
      }
    };

    checkUser();
  }, []);

  // 🔄 Apply state → lighting
  useEffect(() => {
    if (lampMainRef.current) {
      lampMainRef.current.intensity = lampMainIntensity[roomState];
    }

    if (bulbCoreRef.current) {
      bulbCoreRef.current.intensity = bulbCoreIntensity[roomState];
    }
  }, [roomState]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <WelcomeToast userName={userName} roomState={roomState} />
      <Canvas
        /* ❗ CAMERA SETTINGS — UNTOUCHED */
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
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <SceneBackground roomState={roomState} />
        <RoomModel />
        {/* <Plant roomState={roomState} onClick={handleObjectClick} /> */}

        <Plant roomState={roomState} onClick={handleObjectClick} />
        <Lamp roomState={roomState} onClick={handleObjectClick} />
        <WindowModel roomState={roomState} onClick={handleObjectClick} />
        <Bookshelf roomState={roomState} onClick={handleObjectClick} />

        {/* <Plant roomState={roomState} /> original piece if anything goes wrong update this*/}
        {/* <Lamp roomState={roomState} />
        <WindowModel roomState={roomState} />
        <Bookshelf roomState={roomState} /> */}
        {/* 🌈 Postprocessing */}
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

        <pointLight position={[0.5, 1.2, 0]} intensity={0.25} />

        {/* 🧱 Base room only */}
      </Canvas>
      {/* MODAL OVERLAY AFTER CLICKING */}
      {selectedObject && (
        <ObjectModal object={selectedObject} onClose={closeModal} />
      )}
    </div>
  );
};

export default Room;
