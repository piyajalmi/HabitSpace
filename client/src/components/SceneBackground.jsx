import { useThree } from "@react-three/fiber";
import { TextureLoader } from "three";
import { useEffect } from "react";

// put your image in /public/backgrounds/
const BACKGROUND_IMAGE = "/backgrounds/landscape.jpg";

const SceneBackground = () => {
  const { scene } = useThree();

  useEffect(() => {
    const loader = new TextureLoader();

    loader.load(
      BACKGROUND_IMAGE,
      (texture) => {
        texture.colorSpace = "srgb";
        scene.background = texture;
      },
      undefined,
      (err) => {
        console.error("Failed to load background", err);
      },
    );
  }, [scene]);

  return null;
};

export default SceneBackground;
