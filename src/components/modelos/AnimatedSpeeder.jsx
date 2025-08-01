import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import *  as THREE from 'three';
import { Robotsaludo } from './Robotsaludo';

function AnimatedSpeeder() {
  return (
      <>
    <ambientLight intensity={5} />
    <directionalLight position={[-1.7, 0.7, 1.5]} intensity={5} color={"blue"} />
    <Robotsaludo rotation={[0, 0.8, 0]} position ={[-0.8, -0.8, -0.7]} scale={0.3} />
    </>
  );
}

export default AnimatedSpeeder;
