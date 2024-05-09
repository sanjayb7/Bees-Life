import * as THREE from "three";
import { useRef, useState, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Text, TrackballControls } from "@react-three/drei";
import { Bee } from "./Bee";
import axios from "axios";

function Word({ children, ...props }) {
  const color = new THREE.Color();
  const fontProps = {
    // font: "/Inter-Bold.woff",
    fontSize: 0.75,
    letterSpacing: -0.05,
    lineHeight: 1,
    "material-toneMapped": false,
  };
  const ref = useRef();
  const [hovered, setHovered] = useState(false);
  const over = (e) => (e.stopPropagation(), setHovered(true));
  const out = () => setHovered(false);
  // Change the mouse cursor on hover¨
  useEffect(() => {
    if (hovered) document.body.style.cursor = "pointer";
    return () => (document.body.style.cursor = "auto");
  }, [hovered]);
  // Tie component to the render-loop
  useFrame(({ camera }) => {
    ref.current.material.color.lerp(
      color.set(hovered ? "black" : "white"),
      0.1
    );
  });
  return (
    <Billboard {...props}>
      <Text
        ref={ref}
        onPointerOver={over}
        onPointerOut={out}
        onClick={() => console.log("clicked")}
        {...fontProps}
        children={children}
      />
    </Billboard>
  );
}

function Cloud(props) {
  const { names, count, radius } = props;

  const words = useMemo(() => {
    const temp = [];
    const spherical = new THREE.Spherical();
    const phiSpan = Math.PI / (count + 1);
    const thetaSpan = (Math.PI * 2) / count;
    for (let i = 1; i < count + 1; i++)
      for (let j = 0; j < count; j++)
        temp.push([
          new THREE.Vector3().setFromSpherical(
            spherical.set(radius, phiSpan * i, thetaSpan * j)
          ),
          names[j],
        ]);
    return temp;
  }, [count, radius]);

  const wordsElem = [];
  words.forEach(([position, name], index) =>
    wordsElem.push(<Word key={index} position={position} children={name} />)
  );
  return wordsElem;
}

export default function List() {
  const [names, setNames] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.airtable.com/v0/appycAhQVXdCyPbx9/tblvtxaUIwQIdmqlx",
          {
            headers: {
              Authorization:
                "Bearer patBNlVsYnVzRV3aV.7933bc6b05caa11b709acddd85e9c4d5d31108f9d0a30e0caff4ae27323eb0f2",
            },
          }
        );
        console.log("Data fetched:", response.data);
        const rows = [];
        response.data.records.forEach(
          (record) => record.fields.Name && rows.push(record.fields.Name)
        );
        console.log("Rows is:", rows);
        setNames(rows);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return names && names.length > 0 ? (
    <div style={{backgroundColor:"#E9AB17",height:"100vh"}}>
    <Canvas
      key={names.length}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 35], fov: 90 }}
    >
      <fog attach="fog" args={["#202025", 0, 80]} />
      <Suspense fallback={null}>
        <Bee position={[0, 0, 0]} />
        <group rotation={[10, 10.5, 10]}>
          <Cloud count={names.length} radius={20} names={names} />
        </group>
      </Suspense>
      <TrackballControls />
    </Canvas>
    </div>
  ) : (
    <>Loading</>
  );
}
