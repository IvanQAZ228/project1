import { create } from 'zustand';
import { UIState, RenderMode, AppMode } from '../types/store.types';

export const useUIStore = create<UIState>((set) => ({
  appMode: AppMode.VIEW,
  setAppMode: (mode: AppMode) => set({ appMode: mode }),

  isMobileSheetOpen: false,
  setMobileSheetOpen: (open: boolean) => set({ isMobileSheetOpen: open }),

  renderMode: RenderMode.TRANSPARENT,
  setRenderMode: (mode: RenderMode) => set({ renderMode: mode }),
}));
