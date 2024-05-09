import { Float, PerspectiveCamera, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Bee } from "./Bee";
import { Background } from "./Background";
import { Tulip } from "./Tulip";
import { Stone } from "./Stone";
import { Bark } from "./Bark";
import { Daisy } from "./Daisy";
import { Tree } from "./Tree";
import { TextSection } from "./TextSection";
import { fadeOnBeforeCompile } from "../utils/fadeMaterial";
import { useNavigate } from 'react-router-dom'; 



const Link = ({ sceneOpacity,url, children, ...props }) => {
  const [hovered, setHover] = useState(false);
  const meshRef = useRef();
  const navigate = useNavigate();


  const handleMouseOver = () => setHover(true);
  const handleMouseOut = () => setHover(false);

  const materialRef = useRef();

  useFrame(() => {
    materialRef.current.opacity = sceneOpacity.current;
  });

  return (
    <mesh
      {...props}
      ref={meshRef}
      onPointerOver={handleMouseOver}
      onPointerOut={handleMouseOut}
      onClick={() => navigate('/form')} // Open link in a new tab
    >
      <meshStandardMaterial
        ref={materialRef}
        onBeforeCompile={fadeOnBeforeCompile}
        envMapIntensity={2}
        transparent
      />
      {/* <planeGeometry args={[1, 1]} />  */}
      <circleGeometry args={[0.5, 32]} /> {/* Adjust radius and segments as needed */}
      <meshBasicMaterial color={hovered ? "red" : "blue"} />{" "}
      {/* Display text or content */}
    </mesh>
  );
};

const LINE_NB_POINTS = 12000;
const FRICTION_DISTANCE = 42;

export const Nature = () => {
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -120),
        new THREE.Vector3(-2, 0, -240),
        new THREE.Vector3(-3, 0, -360),
        new THREE.Vector3(0, 0, -480),
        new THREE.Vector3(5, 0, -600),
        new THREE.Vector3(7, 0, -720),
        new THREE.Vector3(5, 0, -840),
        new THREE.Vector3(0, 0, -960),
        new THREE.Vector3(0, 0, -1080),
        new THREE.Vector3(0, 0, -1200),
      ],
      false,
      "catmullrom",
      0.5
    );
  }, []);

  const sceneOpacity = useRef(0);
  const lineMaterialRef = useRef();

  const linePoints = useMemo(() => {
    return curve.getPoints(LINE_NB_POINTS);
  }, [curve]);

  const textSections = useMemo(() => {
    return [
      {
        cameraRailDist: -1,
        position: new THREE.Vector3(-3, 1, -100),
        subtitle: `Morning Mission,
        Her day begins with a vital mission: to find pollen and nectar to feed her colony.`,
      },
      {
        cameraRailDist: 1.5,
        position: new THREE.Vector3(1.5, 1, -300),
        title: "A Flower's Gift",
        subtitle: `She collects nectar with her long, tube-like tongue, while pollen sticks to her fuzzy body.`,
      },
      {
        cameraRailDist: -1,
        position: new THREE.Vector3(-2, 1,-450),
        title: "Dance of Directions",
        subtitle: `They dance, wiggling and turning to share information about the best foraging spots they've discovered.`,
      },
      {
        cameraRailDist: 1.5,
        position: new THREE.Vector3(
          linePoints[4].x + 3.5,
          linePoints[4].y,
          -750
        ),
        title: "Harvesting Duties",
        subtitle: `By noon, her legs heavy with pollen, Bella returns to the hive`,
      },
      {
        cameraRailDist: 1.5,
        position: new THREE.Vector3( 0,1,-900),
        title: "The Hive's Hustle",
        subtitle: ` In the hive, Bella deposits her pollen into the honeycomb.`,
      },
      {
        cameraRailDist: 1.5,
        position: new THREE.Vector3(
          linePoints[4].x + 3.5,
          linePoints[4].y,
          -1050
        ),
        title: "Evening Reflections",
        subtitle: `As the sun sets, Bella takes a final flight, savoring the cool evening breeze`,
      },
      {
        cameraRailDist: 1.5,
        position: new THREE.Vector3(
          2,
          0,
          -1200
        ),
        title: "A Call for Action",
        subtitle: ` Yet, despite her hard work, Bella’s world is changing. Click the circle to show some support`,
      },
    ];
  }, []);

  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.2);
    shape.lineTo(0, 0.2);

    return shape;
  }, [curve]);

  const cameraGroup = useRef();
  const cameraRail = useRef();
  const camera = useRef();
  const scroll = useScroll();

  useFrame((_state, delta) => {
    let friction = 1;
    let resetCameraRail = true;
    // LOOK TO CLOSE TEXT SECTIONS
    textSections.forEach((textSection) => {
      const distance = textSection.position.distanceTo(
        cameraGroup.current.position
      );

      if (sceneOpacity.current < 1) {
        sceneOpacity.current = THREE.MathUtils.lerp(
          sceneOpacity.current,
          1,
          delta * 0.1
        );
      }

      if (sceneOpacity.current > 0) {
        sceneOpacity.current = THREE.MathUtils.lerp(
          sceneOpacity.current,
          0,
          delta
        );
      }

      lineMaterialRef.current.opacity = sceneOpacity.current;

      if (distance < FRICTION_DISTANCE) {
        friction = Math.max(distance / FRICTION_DISTANCE, 0.1);
        const targetCameraRailPosition = new THREE.Vector3(
          (1 - distance / FRICTION_DISTANCE) * textSection.cameraRailDist,
          0,
          0
        );
        cameraRail.current.position.lerp(targetCameraRailPosition, delta);
        resetCameraRail = false;
      }
    });
    if (resetCameraRail) {
      const targetCameraRailPosition = new THREE.Vector3(0, 0, 0);
      cameraRail.current.position.lerp(targetCameraRailPosition, delta);
    }

    const curPointIndex = Math.min(
      Math.round(scroll.offset * linePoints.length),
      linePoints.length - 1
    );
    if (curPointIndex > 6000) {
      // beeObj.current
      // bee.current.x = Math
    }
    const curPoint = linePoints[curPointIndex];
    const pointAhead =
      linePoints[Math.min(curPointIndex + 1, linePoints.length - 1)];

    const xDisplacement = (pointAhead.x - curPoint.x) * 80;

    // Math.PI / 2 -> LEFT
    // -Math.PI / 2 -> RIGHT

    const angleRotation =
      (xDisplacement < 0 ? 1 : -1) *
      Math.min(Math.abs(xDisplacement), Math.PI / 3);

    const targetBeeQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        bee.current.rotation.x,
        bee.current.rotation.y,
        angleRotation
      )
    );
    const targetCameraQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        cameraGroup.current.rotation.x,
        angleRotation,
        cameraGroup.current.rotation.z
      )
    );

    bee.current.quaternion.slerp(targetBeeQuaternion, delta * 2);
    cameraGroup.current.quaternion.slerp(targetCameraQuaternion, delta * 2);

    cameraGroup.current.position.lerp(curPoint, delta * 24);
  });

  const bee = useRef();
  // const beeObj = useRef();

  return (
    <>
      {/* <OrbitControls enableZoom={false} /> */}
      <group ref={cameraGroup}>
        <Background />
        <group ref={cameraRail}>
          <PerspectiveCamera
            ref={camera}
            position={[0, 0, 5]}
            fov={30}
            makeDefault
          />
        </group>
        <group ref={bee}>
          <Float floatIntensity={2} speed={2}>
            <Bee
              scale={[0.2, 0.2, 0.2]}
              position={[0, -0.9, 0]}
              rotation={[0, Math.PI / 2, Math.PI / 12]}
              // rotation={[0, 200, 0]}
              // ref={beeObj}
            />
          </Float>
        </group>
      </group>

      {/* text */}
      <group position={[0, 0, -4]}>
        <TextSection
          color="white"
          anchorX="left"
          anchorY="middle"
          fontSize={0.2}
          maxWidth={2.5}
        >
          A day in the life of a bee{"\n"} {/* Corrected newline escape */}
        </TextSection>
      </group>
      {/* LINE */}
      <group position-y={-2}>
        <mesh>
          <extrudeGeometry
            args={[
              shape,
              {
                steps: LINE_NB_POINTS,
                bevelEnabled: false,
                extrudePath: curve,
              },
            ]}
          />
          <meshStandardMaterial
            color={"black"}
            ref={lineMaterialRef}
            transparent
            envMapIntensity={2}
            onBeforeCompile={fadeOnBeforeCompile}
          />
        </mesh>
      </group>
      {textSections.map((textSection, index) => (
        <TextSection {...textSection} key={index} />
      ))}
      {/* Flowers */}
      <Tulip
        sceneOpacity={sceneOpacity}
        scale={[3, 3, 3]}
        position={[2, -1, -10]}
      />
      <Stone
        sceneOpacity={sceneOpacity}
        scale={[8, 8, 8]}
        rotation-y={Math.PI / 9}
        position={[-2, -2, -120]}
      />
      <Tulip
        sceneOpacity={sceneOpacity}
        scale={[2, 2, 2]}
        position={[2, -1, -220]}
      />
      <Bark
        sceneOpacity={sceneOpacity}
        scale={[10, 10, 10]}
        position={[-5, -2, -350]}
      />
      <Daisy
        sceneOpacity={sceneOpacity}
        scale={[5, 5, 5]}
        position={[2, -2, -420]}
      />
      <Stone
        sceneOpacity={sceneOpacity}
        scale={[4, 4, 4]}
        rotation-y={Math.PI / 9}
        position={[5, -1.5, -550]}
      />
      <Daisy
        sceneOpacity={sceneOpacity}
        scale={[4, 4, 4]}
        position={[2.5, -2, -650]}
      />
      <Tulip
        sceneOpacity={sceneOpacity}
        scale={[2, 2, 2]}
        position={[2, -1, -750]}
      />
      <Stone
        sceneOpacity={sceneOpacity}
        scale={[4, 4, 4]}
        rotation-y={Math.PI / 9}
        position={[2, -2, -850]}
      />
      <Tree
        sceneOpacity={sceneOpacity}
        scale={[4, 4, 4]}
        rotation-y={Math.PI / 9}
        position={[2,-2, -850]}
      />
      <Link sceneOpacity={sceneOpacity} url="/form" position={[0, 0, -1200]}>
        Click me!
      </Link>
      {/* <Cloud sceneOpacity={sceneOpacity} scale={[0.2, 0.3, 0.4]} position={[1.5, -0.5, -2]} />
      <Cloud
        opacity={0.7}
        scale={[0.3, 0.3, 0.4]}
        rotation-y={Math.PI / 9}
        position={[2, -0.2, -2]}
      />
      <Cloud
        opacity={0.7}
        scale={[0.4, 0.4, 0.4]}
        rotation-y={Math.PI / 9}
        position={[1, -0.2, -12]}
      />
      <Cloud opacity={0.7} scale={[0.5, 0.5, 0.5]} position={[-1, 1, -53]} />
      <Cloud opacity={0.3} scale={[0.8, 0.8, 0.8]} position={[0, 1, -100]} /> */}
    </>
  );
};
