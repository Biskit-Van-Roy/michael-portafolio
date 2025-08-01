import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Proyectos({ baseHueColor = "#39FF14" }) {
  const sphereRef = useRef();
  const shaderRef = useRef();

  const hueColor = useMemo(() => new THREE.Color(baseHueColor), [baseHueColor]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColors: {
      value: [
        new THREE.Color("#000000"),
        new THREE.Color("#4B0082"),
        hueColor.clone().lerp(new THREE.Color("#FF00FF"), 0.8), // mezcla aurora
        new THREE.Color("#00FF88"),
        new THREE.Color("#000000"),
        new THREE.Color("#00CFFF"),      // azul
      ],
    },
  }), [hueColor]);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    if (sphereRef.current) sphereRef.current.rotation.y += 0.001;
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
            uniform float uTime;
            uniform vec3 uColors[5];

            // Simple noise function
            float noise(vec2 p) {
              return fract(sin(dot(p ,vec2(12.9898,78.233))) * 43758.5453);
            }

            void main() {
              float y = (vPosition.y + 1.0) / 2.0;

              // Movimiento tipo aurora
              float aurora = sin(vPosition.x * 10.0 + uTime * 0.5) * 0.5 + 0.5;
              aurora *= sin(vPosition.y * 15.0 + uTime * 0.8) * 0.5 + 0.5;
              aurora *= noise(vPosition.xz * 5.0 + uTime * 0.2);

              vec3 color;

              if (y < 0.25) {
                float t = y / 0.25;
                color = mix(uColors[0], uColors[1], t);
              } else if (y < 0.5) {
                float t = (y - 0.25) / 0.25;
                color = mix(uColors[1], uColors[2], t);
              } else if (y < 0.75) {
                float t = (y - 0.5) / 0.25;
                color = mix(uColors[2], uColors[3], t);
              } else {
                float t = (y - 0.75) / 0.25;
                color = mix(uColors[3], uColors[4], t);
              }

              color += aurora * 0.5;

              gl_FragColor = vec4(color, 1.0);
            }
          `}
        />
      </mesh>
    </group>
  );
}
