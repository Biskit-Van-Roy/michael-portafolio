import { OrbitControls, ScrollControls } from "@react-three/drei";
import { Spaceman } from "./modelos/Spaceman";
import { CascoScrollControlled } from "./modelos/controllers/CascoScrollControlled";
import { SpaceCamping } from "./modelos/Spacecamping";
import Tarjeta from "./modelos/Tarjeta";
import { FramePortal } from "./modelos/Portal";
import { Proyectos } from "./modelos/Proyectos";
import { usePortalStore } from "./modelos/estados/estadoGlobal";

const Experiencia = () => {
  const insidePortal = usePortalStore((state) => state.insidePortal);
  return (
    <>
      <ambientLight intensity={1} />
      <OrbitControls enableZoom={false} enablePan={!insidePortal} enableRotate={true} key={insidePortal ? "inside" : "outside"} />
      <ScrollControls pages={1} damping={0.4}>
        <Spaceman position={[-0.5, 0, 2]} rotation={[1, 0.6, -1]} />
        {!insidePortal && <Tarjeta position={[1, 0, 10]} />}
        <CascoScrollControlled />
        <FramePortal
          id="01"
          title="EXPERIENCIA"
          startPosition={[-3, 0.4, 2]} // Desde la izquierda
          finalPosition={[1, 0.4, 2]} // Cerca de la cabeza del Spaceman
          rotation={[0.5 + Math.PI, 1, 1.5]} // Invertido verticalmente
          color="#000000"
        >
          <Proyectos baseHueColor="#39FF14" />
        </FramePortal>
        <SpaceCamping position={[-1, 0, 10]} />
      </ScrollControls>
    </>
  );
};

export default Experiencia;