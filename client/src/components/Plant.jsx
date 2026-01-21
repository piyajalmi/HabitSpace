import { useGLTF } from "@react-three/drei";
import { useEffect } from "react";
import { ROOM_STATE_CONFIG } from "../utils/roomState";

const Plant = ({ roomState, anchor }) => {
  const plantStateName = ROOM_STATE_CONFIG[roomState].plant;
  // e.g. "neutral", "missed", etc.

  const { scene } = useGLTF(`/src/assets/models/plant_${plantStateName}.glb`);

  useEffect(() => {
    if (!anchor?.current) return;

    // attach plant to anchor
    anchor.current.clear();
    anchor.current.add(scene);
  }, [scene, anchor]);

  return null;
};

export default Plant;
