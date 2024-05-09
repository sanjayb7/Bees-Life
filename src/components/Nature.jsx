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
        position: new THREE.Vector3(0, 1, -150),
        subtitle: `Welcome to My Life,
Have a seat and enjoy the ride!`,
      },
      {
        cameraRailDist: 1.5,
        position: new THREE.Vector3(4, 1, -300),
        title: "Services",
        subtitle: `Do you want a drink?
We have a wide range of beverages!`,
      },
      {
        cameraRailDist: -1,
        position: new THREE.Vector3(linePoints[3].x - 3, linePoints[3].y, -450),
        title: "Fear of flying?",
        subtitle: `Our flight attendants will help you have a great journey`,
      },
      {
        cameraRailDist: 1.5,
        position: new THREE.Vector3(
          linePoints[4].x + 3.5,
          linePoints[4].y,
          -750
        ),
        title: "Movies",
        subtitle: `We provide a large selection of medias, we highly recommend you Porco Rosso during the flight`,
      },
      {
        cameraRailDist: 1.5,
        position: new THREE.Vector3(
          linePoints[4].x + 3.5,
          linePoints[4].y,
          -900
        ),
        title: "Movies",
        subtitle: `We provide a large selection of medias, we highly recommend you Porco Rosso during the flight`,
      },
      {
        cameraRailDist: 1.5,
        position: new THREE.Vector3(
          linePoints[4].x + 3.5,
          linePoints[4].y,
          -1050
        ),
        title: "Movies",
        subtitle: `We provide a large selection of medias, we highly recommend you Porco Rosso during the flight`,
      },
      {
        cameraRailDist: 1.5,
        position: new THREE.Vector3(
          2,
          0,
          -1200
        ),
        title: "Support Us",
        subtitle: `Click the circle to show us some support, we need you badly!!`,
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
        scale={[1, 1, 1]}
        position={[10, 5, -1]}
      />
      <Stone
        sceneOpacity={sceneOpacity}
        scale={[4, 4, 4]}
        rotation-y={Math.PI / 9}
        position={[2, -1, -12]}
      />
      <Tulip
        sceneOpacity={sceneOpacity}
        scale={[2, 2, 2]}
        position={[0, -0.5, -25]}
      />
      <Bark
        sceneOpacity={sceneOpacity}
        scale={[10, 10, 10]}
        position={[-5, -2, -120]}
      />
      <Daisy
        sceneOpacity={sceneOpacity}
        scale={[5, 5, 5]}
        position={[2.5, -2, -90]}
      />
      <Stone
        sceneOpacity={sceneOpacity}
        scale={[4, 4, 4]}
        rotation-y={Math.PI / 9}
        position={[5, -1.5, -120]}
      />
      <Daisy
        sceneOpacity={sceneOpacity}
        scale={[4, 4, 4]}
        position={[2.5, -2, -150]}
      />
      <Tulip
        sceneOpacity={sceneOpacity}
        scale={[2, 2, 2]}
        position={[2, -1, -80]}
      />
      <Stone
        sceneOpacity={sceneOpacity}
        scale={[4, 4, 4]}
        rotation-y={Math.PI / 9}
        position={[2, -2, -85]}
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
