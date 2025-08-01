import React from 'react'
import { useLoader } from '@react-three/fiber'
import { useGLTF, useTexture } from '@react-three/drei'
import * as THREE from 'three'

export function Mac({ screenImage, ...props }) {
  const { nodes, materials } = useGLTF('/models/mac-draco.glb')
  
  // Load the screen image as a texture
  const screenTexture = screenImage ? useTexture(screenImage) : null
  
  // Create a new material for the screen with the texture
  const screenMaterial = screenImage
    ? new THREE.MeshBasicMaterial({
        map: screenTexture,
        side: THREE.FrontSide,
      })
    : materials['screen.001'] // Fallback to original material if no image

  // Ensure texture wraps correctly (optional, adjust as needed)
  if (screenTexture) {
    screenTexture.flipY = false // Adjust for correct orientation
    screenTexture.needsUpdate = true
  }

  return (
    <group {...props} dispose={null}>
      <group position={[0.002, -0.038, 0.414]} rotation={[0.014, 0, 0]}>
        <group position={[0, 2.965, -0.13]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh geometry={nodes.Cube008.geometry} material={materials.aluminium} />
          <mesh geometry={nodes.Cube008_1.geometry} material={materials['matte.001']} />
          <mesh geometry={nodes.Cube008_2.geometry} material={screenMaterial} /> {/* Apply screen image */}
        </group>
      </group>
      <mesh geometry={nodes.keyboard.geometry} material={materials.keys} position={[1.793, 0, 3.451]} />
      <group position={[0, -0.1, 3.394]}>
        <mesh geometry={nodes.Cube002.geometry} material={materials.aluminium} />
        <mesh geometry={nodes.Cube002_1.geometry} material={materials.trackpad} />
      </group>
      <mesh geometry={nodes.touchbar.geometry} material={materials.touchbar} position={[0, -0.027, 1.201]} />
    </group>
  )
}

useGLTF.preload('/models/mac-draco.glb')