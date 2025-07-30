import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import {
  useCursor,
  MeshPortalMaterial,
  Text,
  useScroll,
} from "@react-three/drei";
import { useRoute, useLocation } from "wouter";
import { easing } from "maath";
import { Estante } from "./Estante";
import { usePortalStore } from "./estados/estadoGlobal";
import AnimatedSpeeder from "./AnimatedSpeeder";
import { Mac } from "./Mac-draco";

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
  const scroll = useScroll();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/item/:id");
  const [hovered, hover] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const isActive = params?.id === id;
  const startX = 3;
  const finalX = position[0];
  const { enterPortal, exitPortal } = usePortalStore();

  useCursor(hovered);

  useEffect(() => {
    if (isActive) {
      enterPortal();
    } else {
      exitPortal();
    }
  }, [isActive, enterPortal, exitPortal]);

  useFrame((state, dt) => {
    const t = scroll.offset;

    // Efecto glow animado
    const glow = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.3;
    setGlowIntensity(glow);

    // Interpolación hacia posición final
    if (groupRef.current) {
      const x = THREE.MathUtils.lerp(startX, finalX, t);
      groupRef.current.position.set(x, position[1], position[2]);
    }

    // Control de mezcla de portal
    easing.damp(portal.current, "blend", isActive ? 1 : 0, 0.2, dt);
  });

  return (
    <group ref={groupRef} rotation={[-0.5, 0.65, 0.36]}>
      {/* Título */}
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
          <color attach="background" args={[color]} />
          <ambientLight intensity={8} position={[0, 2, 0]} />
          <AnimatedSpeeder />
          <Estante position={[-4, 0, -3]} rotation={[0.1, 1, 0]} scale={0.75} />
          <Estante position={[-2, 0, -4]} rotation={[0.1, 0, 0]} scale={0.75} />
          <Estante position={[0, 0, -3]} rotation={[0.1, -1, 0]} scale={0.75} />
          <Mac position={[-4.1, 0.2, -3]} rotation={[0.1, 1, 0]} scale={0.15} />
          <Mac position={[-2, 0.2, -4]} rotation={[0.1, 0, 0]} scale={0.15} />
          <Mac position={[0, 0.2, -3]} rotation={[0, -1, 0]} scale={0.15} />
        </MeshPortalMaterial>
      </mesh>
    </group>
  );
}
