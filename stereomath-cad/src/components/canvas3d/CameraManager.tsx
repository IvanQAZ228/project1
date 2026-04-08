import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { useUIStore } from '../../store/useUIStore';
import { useSketchMode } from '../../hooks/useSketchMode';

export const CameraManager = () => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  const isDrawMode = useUIStore((state: any) => state.isDrawMode);
  const isSketchMode = useSketchMode((state: any) => state.isSketchMode);

  // In real implementation, we would animate camera to face the plane in SketchMode
  // For MVP, we at least manage the OrbitControls state

  useEffect(() => {
    // If we are in draw mode on mobile, or in sketch mode, we might want to disable orbiting
    // to prevent accidental rotations while drawing.
    if (controlsRef.current) {
        // Simple logic: disable orbit if sketching
        controlsRef.current.enabled = !isSketchMode;
    }
  }, [isDrawMode, isSketchMode]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping={true}
      dampingFactor={0.05}
    />
  );
};
