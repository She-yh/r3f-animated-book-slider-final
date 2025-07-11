import { Environment, Float, OrbitControls } from "@react-three/drei";
import { Book } from "./Book";
import { Perf } from "r3f-perf";
export const Experience = () => {
  return (
    <>
      <Perf position="bottom-left" />
      <Book />
      <OrbitControls />
      <Environment preset="studio"></Environment>
      <directionalLight
        position={[2, 5, 2]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
    </>
  );
};
