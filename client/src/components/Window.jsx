import { useGLTF } from "@react-three/drei";
import { WINDOW_MODELS } from "../utils/modelMap";
import { ROOM_STATE_CONFIG } from "../utils/roomState";

const WindowModel = ({ roomState }) => {
  const windowState = ROOM_STATE_CONFIG[roomState]?.window;
  const path = WINDOW_MODELS[windowState];
  if (!path) return null;

  const { scene } = useGLTF(path);
  return <primitive object={scene} position={[0, -0.45, 0]} />;
};

export default WindowModel;
