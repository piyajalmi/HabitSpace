import { useGLTF } from "@react-three/drei";




const RoomModel = () => {
  const { scene } = useGLTF("/models/room.glb");

  return <primitive object={scene} position={[0, -0.45, 0]} />;
};

export default RoomModel;
