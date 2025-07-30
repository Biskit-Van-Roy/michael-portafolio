import { Canvas } from "@react-three/fiber";
import Experiencia from "./components/Experiencia";
import { Suspense } from "react";
import { Html, useProgress } from "@react-three/drei";
import { motion } from "framer-motion";

export function LoadingOverlay() {
  const { progress } = useProgress();

  return (
    <Html center>
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        alignItems: "center", 
        gap: "1rem", 
        color: "#00FF00", 
        fontFamily: "Orbitron",
        textAlign: "center",
        background: "rgba(0, 0, 0, 0.6)",
        padding: "2rem",
        borderRadius: "1rem",
        boxShadow: "0 0 20px rgba(0, 255, 0, 0.5)"
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          style={{
            border: "4px solid #00FF0020",
            borderTop: "4px solid #00FF00FF",
            borderRadius: "50%",
            width: "50px",
            height: "50px",
          }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ fontSize: "1.2rem", margin: 0, textShadow: "0 0 10px #00FF00" }}
        >
          CARGANDO PERFIL DE MICHAEL HIDALGO <span style={{ color: "#FFAE00" }}>{Math.round(progress)}%</span>
        </motion.p>
      </div>
    </Html>
  );
}

function App() {
  return (
    <Canvas camera={{ fov: 64, position: [2.3, 1.5, 2.3] }}>
      <Suspense fallback={<LoadingOverlay />}>
      <Experiencia />
      </Suspense>
      
    </Canvas>
  );
}

export default App;
