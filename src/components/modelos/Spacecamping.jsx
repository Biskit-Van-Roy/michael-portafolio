import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll, Sparkles } from "@react-three/drei";
import * as THREE from "three";

export function SpaceCamping() {
  const scroll = useScroll();
  const sphereRef = useRef();
  const sparklesRef = useRef();
  const shaderRef = useRef();
  const colorStart = useMemo(() => new THREE.Color("#041E3B"), []);
  const colorEnd = useMemo(() => new THREE.Color("#6A0E7C"), []);

  // Definimos un shader simple para el gradiente
  const uniforms = useMemo(
    () => ({
      uColorTop: { value: colorStart.clone() },
      uColorBottom: { value: colorEnd.clone() },
    }),
    [colorStart, colorEnd]
  );
  useFrame((_, delta) => {
    // Rotación lenta
    if (sphereRef.current) sphereRef.current.rotation.y += 0.005 * delta;
    if (sparklesRef.current) sparklesRef.current.rotation.y += 0.002 * delta;

    // Interpolamos colores con el scroll
    const t = scroll.offset ?? 0;
    uniforms.uColorTop.value
      .copy(colorStart)
      .lerp(new THREE.Color("#FF0000"), t);
    uniforms.uColorBottom.value
      .copy(colorEnd)
      .lerp(new THREE.Color("#800000"), t);

    // 📦 Mueve los sparkles hacia atrás con el scroll
    if (sparklesRef.current) {
      sparklesRef.current.position.z = -t * 10; // Puedes ajustar -10 según lo que necesites
    }
  });

  return (
    <group>
      {/* Esfera gigante con shader de gradiente */}
      <mesh ref={sphereRef} scale={100}>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          ref={shaderRef}
          side={THREE.BackSide}
          depthWrite={false}
          uniforms={uniforms}
          vertexShader={`
            varying vec3 vPosition;
            void main() {
              vPosition = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec3 vPosition;
            uniform vec3 uColorTop;
            uniform vec3 uColorBottom;
            void main() {
              float mixFactor = (vPosition.y + 1.0) / 2.0;
              gl_FragColor = vec4(mix(uColorBottom, uColorTop, mixFactor), 1.0);
            }
          `}
        />
      </mesh>

      {/* Sparkles girando */}
      <Sparkles
        key={Math.round(scroll.offset * 100)} // fuerza el re-render cada 1% de scroll
        ref={sparklesRef}
        count={1500}
        scale={[80, 80, 80]}
        size={50}
        speed={0.5 + scroll.offset * 10}
        noise={1}
        color="white"
      />
    </group>
  );
}
