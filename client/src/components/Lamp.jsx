import { useGLTF } from "@react-three/drei";
import { LAMP_MODELS } from "../utils/modelMap";
import { ROOM_STATE_CONFIG } from "../utils/roomState";

const Lamp = ({ roomState }) => {
  const lampState = ROOM_STATE_CONFIG[roomState]?.lamp;
  const path = LAMP_MODELS[lampState];
  if (!path) return null;

  const { scene } = useGLTF(path);
  return <primitive object={scene} position={[0, -0.45, 0]} />;
};

export default Lamp;
