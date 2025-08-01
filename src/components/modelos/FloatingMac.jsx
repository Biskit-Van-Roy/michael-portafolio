import * as THREE from 'three'
import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useCursor, useGLTF } from '@react-three/drei'
import { useRoute, useLocation } from 'wouter'
import { easing } from 'maath'
import { Mac } from './Mac-draco'

// FloatingMacPortal Component
export function FloatingMacPortal({ id, screenImage, position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }) {
  const groupRef = useRef()
  const [hovered, setHovered] = useState(false)
  const { nodes, materials } = useGLTF('/models/mac-draco.glb')
  const [, params] = useRoute('/item/:id')
  const [, setLocation] = useLocation()
  const isActive = params?.id === id

  useCursor(hovered)

  useEffect(() => {
    if (isActive) document.body.style.cursor = 'default'
  }, [isActive])

  useFrame((state, dt) => {
    const t = state.clock.getElapsedTime()

    // Apply subtle floating animation
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t / 2) * 0.05
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        rotation[0] + Math.cos(t / 2) / 20,
        0.1
      )
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        rotation[1] + Math.sin(t / 4) / 20,
        0.1
      )
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        rotation[2] + Math.sin(t / 8) / 20,
        0.1
      )
    }
  })

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1], position[2]]}
      rotation={rotation}
      scale={scale}
      onClick={(e) => {
        e.stopPropagation()
        setLocation(`/item/${id}`)
      }}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <Mac position={[0, -0.2, 0.4]} scale={0.8} rotation={[0.05, 0, 0]} screenImage={screenImage} />
    </group>
  )
}

// Scene Component to Render Three Macs
export default function Scene() {
  const testImage = 'https://picsum.photos/id/237/1024/670' // Test image for all Macs
  return (
    <>
      {/* First Mac */}
      <FloatingMacPortal
        id="mac1"
        screenImage={testImage}
        position={[-2, 1, 0]} // Top-left
        rotation={[0, 0.4, 0]}
        scale={1}
      />
      {/* Second Mac */}
      <FloatingMacPortal
        id="mac2"
        screenImage={testImage}
        position={[2, 1, 0]} // Top-right
        rotation={[0, -0.4, 0]}
        scale={1}
      />
      {/* Third Mac */}
      <FloatingMacPortal
        id="mac3"
        screenImage={testImage}
        position={[0, -1, 0]} // Bottom-center
        rotation={[0, 0, 0]}
        scale={1}
      />
    </>
  )
}