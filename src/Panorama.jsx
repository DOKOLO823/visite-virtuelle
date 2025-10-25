import React, { useEffect } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export default function Panorama({ texturePath }) {
  const texture = useLoader(THREE.TextureLoader, texturePath);

  useEffect(() => {
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.encoding = THREE.sRGBEncoding;
    texture.anisotropy = 16;
  }, [texture]);

  return (
    <mesh>
      <sphereGeometry args={[500, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}
