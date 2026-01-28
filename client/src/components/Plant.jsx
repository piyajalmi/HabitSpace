import { useGLTF } from "@react-three/drei";
import { PLANT_MODELS } from "../utils/modelMap";
import { ROOM_STATE_CONFIG } from "../utils/roomState";

const Plant = ({ roomState }) => {
  const plantStateName = ROOM_STATE_CONFIG[roomState].plant;
  const { scene } = useGLTF(PLANT_MODELS[plantStateName]);

  return <primitive object={scene} position={[0, -0.45, 0]} />;
};

export default Plant;
