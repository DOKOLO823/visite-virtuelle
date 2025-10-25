import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function CameraMover({ speed = 10, zoomLevel }) {
  const { camera } = useThree();

  useEffect(() => {
    const handleKeyDown = (e) => {
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      direction.normalize();

      const lateral = new THREE.Vector3().crossVectors(direction, camera.up).normalize();

      switch (e.key.toLowerCase()) {
        case 'w':
          camera.position.addScaledVector(direction, speed);
          break;
        case 's':
          camera.position.addScaledVector(direction, -speed);
          break;
        case 'a':
          camera.position.addScaledVector(lateral, speed);
          break;
        case 'd':
          camera.position.addScaledVector(lateral, -speed);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [camera, speed]);

  useEffect(() => {
    camera.fov = zoomLevel;
    camera.updateProjectionMatrix();
  }, [zoomLevel]);

  return null;
}
