import { useGLTF } from "@react-three/drei";
import { BOOKSHELF_MODELS } from "../utils/modelMap";
import { ROOM_STATE_CONFIG } from "../utils/roomState";

const Bookshelf = ({ roomState }) => {
  const shelfState = ROOM_STATE_CONFIG[roomState]?.bookshelf;
  const path = BOOKSHELF_MODELS[shelfState];
  if (!path) return null;

  const { scene } = useGLTF(path);
  return <primitive object={scene} position={[0, -0.45, 0]} />;
};

export default Bookshelf;
