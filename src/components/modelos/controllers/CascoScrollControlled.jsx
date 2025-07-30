import React, { useRef, useLayoutEffect } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import gsap from "gsap";
import { Casco } from "../Casco";

export function CascoScrollControlled({
  startPos = new THREE.Vector3(0, 0, 0),
  startRot = new THREE.Euler(0, -Math.PI / 2, Math.PI),
  endPos = new THREE.Vector3(1.6, 0.9, 2), 
  endRot = new THREE.Euler(0, 1, 0),
  duration = 1,
  ...props
}) {
  const scroll = useScroll();
  const wrapper = useRef();
  const tl = useRef();
  const isRotating = useRef(false);

  useLayoutEffect(() => {
    if (!wrapper.current) return;

    wrapper.current.position.copy(startPos);
    wrapper.current.rotation.copy(startRot);

    tl.current = gsap.timeline({ paused: true });

    tl.current.to(
      wrapper.current.position,
      {
        x: endPos.x,
        y: endPos.y,
        z: endPos.z,
        duration,
        ease: "none",
      },
      0
    );

    tl.current.to(
      wrapper.current.rotation,
      {
        x: endRot.x,
        y: endRot.y,
        z: endRot.z,
        duration,
        ease: "none",
      },
      0
    );
  }, [duration, endPos, endRot, startPos, startRot]);

  useFrame(() => {
    if (!tl.current || !wrapper.current) return;

    const t = scroll.offset;
    tl.current.progress(t);

    if (t >= 0.5 && !isRotating.current) {
      isRotating.current = true;
    }

    if (isRotating.current) {
      wrapper.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={wrapper} {...props}>
      <Casco />
    </group>
  );
}
