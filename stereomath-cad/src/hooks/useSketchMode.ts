import { create } from 'zustand';
import * as THREE from 'three';
import { LocalSystem2D } from '../core/math/LocalSystem2D';

interface SketchModeState {
  isSketchMode: boolean;
  activeFaceId: string | null;
  localSystem: LocalSystem2D | null;
  enterSketchMode: (faceId: string, origin: THREE.Vector3, normal: THREE.Vector3) => void;
  exitSketchMode: () => void;
}

// Manage sketch mode state
export const useSketchMode = create<SketchModeState>((set) => ({
  isSketchMode: false,
  activeFaceId: null,
  localSystem: null,

  enterSketchMode: (faceId, origin, normal) => {
    const localSystem = new LocalSystem2D(origin, normal);
    set({
      isSketchMode: true,
      activeFaceId: faceId,
      localSystem,
    });
  },

  exitSketchMode: () => {
    set({
      isSketchMode: false,
      activeFaceId: null,
      localSystem: null,
    });
  },
}));
