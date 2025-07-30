import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Speeder(props) {
  const { nodes, materials } = useGLTF('/models/speeder.glb')
  return (
    <group {...props} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <mesh geometry={nodes.defaultMaterial.geometry} material={materials.material} />
          <mesh geometry={nodes.defaultMaterial_1.geometry} material={materials.engines} />
          <mesh geometry={nodes.defaultMaterial_2.geometry} material={materials.glass} />
          <mesh geometry={nodes.defaultMaterial_3.geometry} material={materials.low_back} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/speeder.glb')
