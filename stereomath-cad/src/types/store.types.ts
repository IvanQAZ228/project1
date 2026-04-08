import { AnyNode } from './graph.types';

export interface GraphState {
  nodes: Record<string, AnyNode>;
  selectedNodeIds: string[];
  addNode: (node: AnyNode) => void;
  removeNode: (id: string) => void;
  updateNode: (id: string, data: Partial<AnyNode>) => void;
  selectNode: (id: string, multi?: boolean) => void;
  clearSelection: () => void;
  clearGraph: () => void;
}

export enum ToolMode {
  SELECT = 'SELECT',
  POINT = 'POINT',
  LINE = 'LINE',
  PLANE = 'PLANE',
  CUBE = 'CUBE',
  PYRAMID = 'PYRAMID',
  SECTION = 'SECTION',
  SKETCH = 'SKETCH'
}

export interface ToolState {
  activeTool: ToolMode;
  setActiveTool: (tool: ToolMode) => void;
  toolStepData: any[];
  setToolStepData: (data: any[]) => void;
}

export enum RenderMode {
  SOLID = 'SOLID',
  WIREFRAME = 'WIREFRAME',
  TRANSPARENT = 'TRANSPARENT'
}

export interface UIState {
  isMobileSheetOpen: boolean;
  setMobileSheetOpen: (open: boolean) => void;
  isDrawMode: boolean; // For mobile toggle: [ View / Draw ]
  setDrawMode: (draw: boolean) => void;
  renderMode: RenderMode;
  setRenderMode: (mode: RenderMode) => void;
}
