import { Environment, Sphere } from "@react-three/drei";
import { Gradient, LayerMaterial } from "lamina";

import * as THREE from "three";

export const Background = () => {
  return (
    <>
      <Environment preset="forest" />
      <Sphere scale={[100, 100, 100]} rotation-y={Math.PI / 2}>
        <LayerMaterial
          color={"#ffffff"}
          lighting="physical"
          transmission={1}
          side={THREE.BackSide}
        >
          <Gradient
            colorA={"#357ca1"}
            colorB={"#4CAF50"}
            axes={"y"}
            start={0.2}
            end={-0.5}
          />
        </LayerMaterial>
      </Sphere>
    </>
  );
};
