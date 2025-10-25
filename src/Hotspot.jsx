import React from 'react';
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';

export default function Hotspot({ position, onClick, label = '' }) {
  const icon = useLoader(TextureLoader, '/icons/hotspot.png');

  return (
    <mesh position={position} onClick={onClick}>
      <planeGeometry args={[20, 20]} />
      <meshBasicMaterial map={icon} transparent />
    </mesh>
  );
}
