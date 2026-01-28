import { useGLTF } from "@react-three/drei";
import { PLANT_MODELS } from "../utils/modelMap";
import { ROOM_STATE_CONFIG } from "../utils/roomState";

const Plant = ({ roomState }) => {
  const plantStateName = ROOM_STATE_CONFIG[roomState]?.plant;
  const modelPath = PLANT_MODELS[plantStateName];

  console.log("RoomState:", roomState);
  console.log("Plant state:", plantStateName);
  console.log("Model path:", modelPath);

  if (!modelPath) return null; // ⛔ prevents crash

  const { scene } = useGLTF(modelPath);

  return <primitive object={scene} position={[0, -0.45, 0]} />;
};

export default Plant;
