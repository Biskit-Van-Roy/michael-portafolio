import React, { useRef, useState } from "react";
import { Html, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const Tarjeta = () => {
  const groupRef = useRef();
  const scroll = useScroll();

  // Estado para guardar el brillo actual (intensidad)
  const [glowIntensity, setGlowIntensity] = useState(0);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const x = scroll.offset * 5;
      groupRef.current.rotation.z = x;
      groupRef.current.position.y = x;
    }

    // Actualizar la intensidad del glow oscilando entre 0.7 y 1.3 por ejemplo
    const glow = 1 + Math.sin(clock.elapsedTime * 3) * 0.3; // pulsación
    setGlowIntensity(glow);
  });

  // Generar los estilos dinámicos usando glowIntensity para el textShadow y boxShadow
  const textShadow = `0 0 ${10 * glowIntensity}px #0ff, 0 0 ${8 * glowIntensity}px #0ef`;
  const imgBoxShadow = `0 0 ${10 * glowIntensity}px #0ff, 0 0 ${30 * glowIntensity}px #f0f`;

  return (
    <group ref={groupRef}>
      <Html
        transform
        position={[-1, -3, -10]}
        rotation={[-0.6, 0.6, 0.4]}
        occlude
        style={{
          width: "300px",
          textAlign: "start",
          color: "black",
          fontFamily: "'Orbitron', sans-serif",
          textShadow: "0 0 8px #f0f, 0 0 12px #0ff", // base shadow para todo el contenedor
        }}
      >
        <div>
          <p
            style={{
              fontWeight: "bold",
              margin: 0,
              color: "white",
              fontSize: "1.4em",
              textShadow,
            }}
          >
            ⚠️ Michael Hidalgo ⚠️
          </p>
          <p
            style={{
              marginTop: "0.5em",
              color: "yellow",
              fontSize: "1em",
              textShadow,
            }}
          >
            🤖 Desarrollador FullStack
          </p>
          <p
            style={{
              marginTop: "0.5em",
              color: "yellow",
              fontSize: "1em",
              textShadow,
            }}
          >
            📱 Desarrollador Móvil
          </p>
          <img
            src="/images/roy.jpeg"
            alt="imagen"
            style={{
              width: "60%",
              marginTop: "1em",
              border: "3px solid #0ff",
              borderRadius: "4px",
              boxShadow: imgBoxShadow,
              transition: "box-shadow 0.1s ease-out",
            }}
          />
        </div>
      </Html>
    </group>
  );
};

export default Tarjeta;
