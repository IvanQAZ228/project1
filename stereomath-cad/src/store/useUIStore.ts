import { create } from 'zustand';
import { UIState, RenderMode } from '../types/store.types';

export const useUIStore = create<UIState>((set) => ({
  isMobileSheetOpen: false,
  setMobileSheetOpen: (open: boolean) => set({ isMobileSheetOpen: open }),

  isDrawMode: false,
  setDrawMode: (draw: boolean) => set({ isDrawMode: draw }),

  renderMode: RenderMode.TRANSPARENT,
  setRenderMode: (mode: RenderMode) => set({ renderMode: mode }),
}));
