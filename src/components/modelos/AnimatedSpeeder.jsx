import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Speeder } from './Speeder';

function AnimatedSpeeder() {
  const speederRef = useRef();
  const radius = 2; // radio del círculo
  const speed = 0.5; // velocidad de rotación (radianes/segundo)

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed; // tiempo animado
    const x = Math.cos(t) * radius;
    const z = Math.sin(t) * radius;
    
    if (speederRef.current) {
      speederRef.current.position.set(x, 1, z);
      // Para que siempre mire hacia el centro
      speederRef.current.lookAt(0, 1, 0);
    }
  });

  return (
    <Speeder ref={speederRef} rotation={[0, -Math.PI / 2, 0]} />
  );
}

export default AnimatedSpeeder;
