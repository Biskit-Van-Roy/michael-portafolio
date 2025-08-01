import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  useCursor,
  MeshPortalMaterial,
  Text,
  useScroll,
  OrbitControls,
} from "@react-three/drei";
import { useRoute, useLocation } from "wouter";
import { easing } from "maath";
import { Estante } from "./Estante";
import { usePortalStore } from "./estados/estadoGlobal";
import AnimatedSpeeder from "./AnimatedSpeeder";
import { FloatingMacPortal } from "./FloatingMac";

export function FramePortal({
  id,
  title,
  children,
  position = [0, 0, 0],
  width = 1,
  height = 1.6,
  color = "#ffffff",
}) {
  const portal = useRef();
  const groupRef = useRef();
  const curtainRef = useRef();
  const scroll = useScroll();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/item/:id");
  const [hovered, hover] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const isActive = params?.id === id;
  const { enterPortal, exitPortal, insidePortal } = usePortalStore();
  const { camera, gl } = useThree();
  const [animationDone, setAnimationDone] = useState(false);
  const startZ = -2; // Posición inicial en Z (más lejana)
  const finalZ = 0;  // Posición final en Z (más cercana a la cámara)

  useCursor(hovered);

  useEffect(() => {
    if (isActive) {
      enterPortal();
    } else {
      exitPortal();
      setAnimationDone(false);
    }
  }, [isActive, enterPortal, exitPortal]);

  const neonColors = [
    new THREE.Color("#FF00FF"), // magenta neón
    new THREE.Color("#FF4500"), // naranja neón
    new THREE.Color("#000000"),
    new THREE.Color("#39FF14"), // verde neón
  ];
  useFrame((state, dt) => {
    const t = state.clock.getElapsedTime();

    // Camera animation
    if (isActive && insidePortal && !animationDone) {
      const scenePanningDuration = 3.5;
      const transitionDuration = 2;
      const sceneRadius = 8;
      const sceneCentroid = new THREE.Vector3(-1.4, 0.23, -3);
      const groupMatrix = groupRef.current.matrixWorld;
      const worldSceneCentroid = sceneCentroid.clone().applyMatrix4(groupMatrix);
      const initialPosition = state.camera.initialPosition || new THREE.Vector3(-0.3, 0, 1).applyMatrix4(groupMatrix);

      if (t < scenePanningDuration) {
        state.gl.domElement.style.pointerEvents = "none";
        const angle = (t / scenePanningDuration) * Math.PI * 2;
        const localCameraPos = new THREE.Vector3(
          sceneCentroid.x + sceneRadius * Math.cos(angle),
          1,
          sceneCentroid.z + sceneRadius * Math.sin(angle)
        );
        camera.position.copy(localCameraPos.applyMatrix4(groupMatrix));
        camera.lookAt(worldSceneCentroid);
      } else {
        state.gl.domElement.style.pointerEvents = "none";
        easing.damp3(camera.position, initialPosition, 0.2, dt);
  
        if (camera.position.distanceTo(initialPosition) < 0.00001) {
          setAnimationDone(true);
          state.gl.domElement.style.pointerEvents = "auto";
        }
      }
    }

    // Group, glow, and curtain animations
    const scrollT = scroll ? scroll.offset : 0;
    const glow = 1 + Math.sin(t * 3) * 0.3;
    setGlowIntensity(glow);

    if (groupRef.current) {
      const z = THREE.MathUtils.lerp(startZ, finalZ, scrollT);
      groupRef.current.position.set(position[0]+z+1.5, position[1]+0.5, z*3.5);
    }

    easing.damp(portal.current, "blend", isActive ? 1 : 0, 0.2, dt);

    if (curtainRef.current) {
      const targetScaleY = hovered ? 1 : 0;
      curtainRef.current.scale.y = THREE.MathUtils.lerp(
        curtainRef.current.scale.y,
        targetScaleY,
        dt * 5
      );
      curtainRef.current.material.opacity = THREE.MathUtils.lerp(
        curtainRef.current.material.opacity,
        hovered ? 0.7 : 0,
        dt * 5
      );
      curtainRef.current.material.color.set("#FF00FF");
    }
  });
  return (
    <group ref={groupRef} rotation={[-0.5, 0.65, 0.36]}>
      <Text
        fontSize={0.13}
        position={[0, 0.7, 0.01]}
        anchorX="center"
        anchorY="bottom"
        material-toneMapped={false}
        font="/font/Orbitron.ttf"
        color="greenyellow"
        outlineWidth={0.01}
        outlineColor="#00D9FF"
        outlineOpacity={0.5}
        outlineBlur={0.3}
      >
        {title}
      </Text>
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[width * 1.1, height * 1.1]} />
        <meshBasicMaterial
          color={"#4FFF2CFF"}
          transparent
          opacity={hovered ? glowIntensity * 0.3 : 0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh
        ref={curtainRef}
        position={[0, 0, 0.05]}
        scale={[1, 0, 1]}
      >
        <planeGeometry args={[width * 1.1, height * 1.1]} />
        <meshBasicMaterial
          color="yellow"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
      <mesh
        name={id}
        onClick={(e) => (e.stopPropagation(), setLocation(`/item/${id}`))}
        onPointerOver={() => hover(true)}
        onPointerOut={() => hover(false)}
      >
        <planeGeometry args={[width, height, 1]} />        
        <MeshPortalMaterial
          ref={portal}
          events={params?.id === id}
          side={THREE.DoubleSide}
        >
          <ambientLight intensity={8} position={[0, 2, 0]} />
          <AnimatedSpeeder />
          {children}
          <Estante position={[-1.5, 0, 0.2]} rotation={[-1.6, -1.4, -2]} scale={0.3} />
          <Estante position={[-0.85,0.2,-0.3]} rotation={[0.55, 0.30, -0.15]} scale={0.3} />
          <Estante position={[-0,0,-0.3]} rotation={[0.2, -1, -0.40]} scale={0.3} />
          <FloatingMacPortal position={[-1.65, 0.1, 0.25]} rotation={[1.8, 1.45, -1.5]} scale={0.07} url="https://example.com"/>
          <FloatingMacPortal position={[-0.85,0.4,-0.3]} rotation={[0.55, 0.30, -0.15]} scale={0.07} url="https://example.com"/>
          <FloatingMacPortal position={[0.15,0.16,-0.4]} rotation={[0.26, -1.1, -0.3]} scale={0.07} url="https://example.com"/>
        </MeshPortalMaterial>
      </mesh>
    </group>
  );
}