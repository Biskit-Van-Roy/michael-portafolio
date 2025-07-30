import * as THREE from 'three'
import React, { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  MeshPortalMaterial,
  useCursor,
  useGLTF,
} from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import { easing } from 'maath'
import Example from '../HeroPage'
import { Mac } from './Mac-draco'


export function FloatingMacPortal({ id, position = [0, 0, 0] }) {
  const portal = useRef()
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  const { nodes, materials } = useGLTF('/models/mac-draco.glb')
  const [match, params] = useRoute("/item/:id")
  const [, setLocation] = useLocation()
  const isActive = params?.id === id

  useCursor(hovered)

  useEffect(() => {
    if (isActive) document.body.style.cursor = 'default'
  }, [isActive])

  useFrame((state, dt) => {
    const t = state.clock.getElapsedTime()

    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, Math.cos(t / 2) / 20 + 0.25, 0.1)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, Math.sin(t / 4) / 20, 0.1)
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, Math.sin(t / 8) / 20, 0.1)
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, (-2 + Math.sin(t / 2)) / 2, 0.1)

    easing.damp(portal.current, 'blend', isActive ? 1 : 0, 0.2, dt)
  })

  return (
    <group ref={groupRef} position={position}>
      <mesh
        onClick={(e) => {
          e.stopPropagation()
          setLocation(`/item/${id}`)
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[4.5, 3, 0.2]} />
        <MeshPortalMaterial ref={portal} side={THREE.DoubleSide}>
          <color attach="background" args={["#020202FF"]} />
          <ambientLight intensity={10} position={[0,1,0]}/>
         <Mac/>
        </MeshPortalMaterial>
      </mesh>
    </group>
  )
}
