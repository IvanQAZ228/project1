import { create } from 'zustand';
import { ToolMode, ToolState } from '../types/store.types';

export const useToolStore = create<ToolState>((set) => ({
  activeTool: ToolMode.SELECT,
  setActiveTool: (tool: ToolMode) => set({ activeTool: tool, toolStepData: [] }),
  toolStepData: [],
  setToolStepData: (data: any[]) => set({ toolStepData: data }),
}));
