import React, { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function CameraControls({ speed = 10, zoomLevel, setZoomLevel }) {
  const { camera } = useThree();
  const direction = new THREE.Vector3();

  // ⌨️ Clavier
  useEffect(() => {
    const handleKeyDown = (e) => {
      camera.getWorldDirection(direction);
      direction.normalize();

      if (e.key === 'w') camera.position.addScaledVector(direction, speed);
      if (e.key === 's') camera.position.addScaledVector(direction, -speed);
      if (e.key === 'a') {
        const left = new THREE.Vector3().crossVectors(camera.up, direction).normalize();
        camera.position.addScaledVector(left, speed);
      }
      if (e.key === 'd') {
        const right = new THREE.Vector3().crossVectors(direction, camera.up).normalize();
        camera.position.addScaledVector(right, speed);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [camera, speed]);

  // 🎯 Appliquer zoom depuis le slider
  useEffect(() => {
    camera.fov = zoomLevel;
    camera.updateProjectionMatrix();
  }, [zoomLevel]);

  return null;
}
