import { OrbitControls, ScrollControls} from "@react-three/drei";
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
      <OrbitControls enableZoom={false} enablePan={false}  key={insidePortal ? "inside" : "outside"}/>
      <ScrollControls pages={2} damping={0.4}>
        <Spaceman position={[-0.5, 0, 2]} rotation={[1, 0.6, -1]} />
         {!insidePortal && <Tarjeta position={[1, 0, 10]} />}
        <CascoScrollControlled />
        <FramePortal
          id="01"
          title="EXPERIENCIA"
          position={[1.5, 0.4, 0.5]}
          rotation = {[0.5, 1, 1.5]}
          color="#FAA52F"
        >
          <Proyectos />
        </FramePortal>
        <SpaceCamping position={[-1, 0, 10]} />
      </ScrollControls>
    </>
  );
};

export default Experiencia;
