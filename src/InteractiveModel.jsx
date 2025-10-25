import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export default function InteractiveModel({ path, position, info, onClick }) {
  const { scene } = useGLTF(path);
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      ref.current.traverse((child) => {
        if (child.isMesh) {
          child.material.side = THREE.DoubleSide;
        }
      });
    }
  }, []);

  return (
    <group ref={ref} position={position} onClick={() => onClick(info)}>
      <primitive object={scene} scale={5} />
    </group>
  );
}
