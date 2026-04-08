import { useThree } from '@react-three/fiber';
import { useCallback } from 'react';
import * as THREE from 'three';

export const useRaycaster = () => {
  const { camera, scene, raycaster, pointer } = useThree();

  const getRaycaster = useCallback(() => {
    raycaster.setFromCamera(pointer, camera);
    return raycaster;
  }, [camera, pointer, raycaster]);

  return { getRaycaster, scene, camera };
};
