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

  // Points (7)
  POINT_FREE = 'POINT_FREE',
  POINT_ON_EDGE = 'POINT_ON_EDGE',
  POINT_ON_FACE = 'POINT_ON_FACE',
  POINT_MIDPOINT = 'POINT_MIDPOINT',
  POINT_INTERSECT_LINES = 'POINT_INTERSECT_LINES',
  POINT_INTERSECT_LINE_PLANE = 'POINT_INTERSECT_LINE_PLANE',
  POINT_BY_COORDS = 'POINT_BY_COORDS',

  // Lines (8)
  LINE_SEGMENT = 'LINE_SEGMENT',
  LINE_INFINITE = 'LINE_INFINITE',
  LINE_RAY = 'LINE_RAY',
  LINE_VECTOR = 'LINE_VECTOR',
  LINE_PARALLEL = 'LINE_PARALLEL',
  LINE_PERPENDICULAR = 'LINE_PERPENDICULAR',
  LINE_BISECTOR = 'LINE_BISECTOR',
  LINE_POLYLINE = 'LINE_POLYLINE',

  // Planes (4)
  PLANE_BY_3_POINTS = 'PLANE_BY_3_POINTS',
  PLANE_BY_LINE_POINT = 'PLANE_BY_LINE_POINT',
  PLANE_PARALLEL = 'PLANE_PARALLEL',
  PLANE_PERPENDICULAR = 'PLANE_PERPENDICULAR',

  // Sections & Stereometry (6)
  SECTION_BY_PLANE = 'SECTION_BY_PLANE',
  SECTION_SLICE = 'SECTION_SLICE',
  INTERSECT_PLANES = 'INTERSECT_PLANES',
  EXTRUDE = 'EXTRUDE',
  UNFOLD = 'UNFOLD',
  PROJECT_TO_PLANE = 'PROJECT_TO_PLANE',

  // Solids (10)
  SOLID_TETRAHEDRON = 'SOLID_TETRAHEDRON',
  SOLID_CUBE = 'SOLID_CUBE',
  SOLID_CUBOID = 'SOLID_CUBOID',
  SOLID_PRISM = 'SOLID_PRISM',
  SOLID_PYRAMID_REGULAR = 'SOLID_PYRAMID_REGULAR',
  SOLID_PYRAMID_ARBITRARY = 'SOLID_PYRAMID_ARBITRARY',
  SOLID_OCTAHEDRON = 'SOLID_OCTAHEDRON',
  SOLID_ICOSAHEDRON = 'SOLID_ICOSAHEDRON',
  SOLID_CYLINDER = 'SOLID_CYLINDER',
  SOLID_CONE = 'SOLID_CONE',

  // Measurements (5)
  MEASURE_DISTANCE = 'MEASURE_DISTANCE',
  MEASURE_ANGLE = 'MEASURE_ANGLE',
  MEASURE_DIHEDRAL_ANGLE = 'MEASURE_DIHEDRAL_ANGLE',
  MEASURE_AREA = 'MEASURE_AREA',
  MEASURE_VOLUME = 'MEASURE_VOLUME',

  // Other tools
  SKETCH = 'SKETCH',
  POINT = 'POINT',
  LINE = 'LINE',
  PLANE = 'PLANE',
  CUBE = 'CUBE',
  PYRAMID = 'PYRAMID',
  SECTION = 'SECTION'
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

export enum AppMode {
  VIEW = 'VIEW',
  CONSTRUCT = 'CONSTRUCT',
  SKETCH = 'SKETCH'
}

export interface UIState {
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  isMobileSheetOpen: boolean;
  setMobileSheetOpen: (open: boolean) => void;
  renderMode: RenderMode;
  setRenderMode: (mode: RenderMode) => void;
}
