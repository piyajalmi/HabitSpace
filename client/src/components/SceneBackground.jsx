import { useThree } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useEffect } from "react";
import { BACKGROUND_MAP } from "../utils/modelMap";

const SceneBackground = ({ roomState }) => {
  const { scene } = useThree();

  useEffect(() => {
    const loader = new TextureLoader();
    const imagePath = BACKGROUND_MAP[roomState];

    if (!imagePath) return;

    loader.load(imagePath, (texture) => {
      scene.background = texture;
    });
  }, [scene, roomState]);

  return null;
};

export default SceneBackground;
