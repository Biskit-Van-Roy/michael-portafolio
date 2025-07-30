import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useScroll, Sparkles } from "@react-three/drei";
import * as THREE from "three";

export function Proyectos() {
  const scroll = useScroll();
  const sphereRef = useRef();
  const sparklesRef = useRef();
  const shaderRef = useRef();
  const colorStart = useMemo(() => new THREE.Color("#FFFFFF"), []);
  const colorEnd = useMemo(() => new THREE.Color("#FFFFFF"), []);
  const uniforms = useMemo( 
    () => ({
      uColorTop: { value: colorStart.clone() },
      uColorBottom: { value: colorEnd.clone() },
    }),
    [colorStart, colorEnd]
  );
  useFrame((_, delta) => {    
    if (sphereRef.current) sphereRef.current.rotation.y += 0.005 * delta;
    if (sparklesRef.current) sparklesRef.current.rotation.y += 0.002 * delta;
    const t = scroll.offset ?? 0;
    uniforms.uColorTop.value
      .copy(colorStart)
      .lerp(new THREE.Color("#0084FF"), t);
    uniforms.uColorBottom.value
      .copy(colorEnd)
      .lerp(new THREE.Color("#F107F1"), t);
    if (sparklesRef.current) {
      sparklesRef.current.position.z = -t * 10; // Puedes ajustar -10 según lo que necesites
    }
  });

  return (
    <group>
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

    </group>
  );
}
