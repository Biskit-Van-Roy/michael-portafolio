import { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function Casco(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF("/models/casco.glb");

  return (
    <group ref={group} {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, Math.PI]} scale={0.346}>
        <group rotation={[Math.PI / 2, 0, 0]} scale={0.025}>
          <mesh
            geometry={nodes.MSH_bASE_mODEL_mat_Base_0.geometry}
            material={materials.mat_Base}
            position={[5.252, 0.863, -2.135]}
            rotation={[-Math.PI / 2, 0, -0.078]}
            scale={3.224}
          />
          <mesh
            geometry={nodes.MSH_bASE_mODEL_outline_MAT_oUTLINE_0.geometry}
            material={materials.MAT_oUTLINE}
            position={[5.252, 0.863, -2.135]}
            rotation={[-Math.PI / 2, 0, -0.078]}
            scale={3.224}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("/models/casco.glb");
