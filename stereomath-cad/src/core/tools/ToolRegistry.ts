import { BaseTool } from './BaseTool';
import { PointFreeTool } from './PointTool';
import { LineSegmentTool } from './LineTools';
import { PlaneBy3PointsTool } from './PlaneTools';
import { CubeTool } from './SolidTools';
import { DistanceMeasureTool } from './MeasurementTools';
import { ToolMode } from '../../types/store.types';

export const ToolRegistry: Record<string, BaseTool> = {
  [ToolMode.POINT_FREE]: new PointFreeTool(),
  [ToolMode.LINE_SEGMENT]: new LineSegmentTool(),
  [ToolMode.PLANE_BY_3_POINTS]: new PlaneBy3PointsTool(),
  [ToolMode.SOLID_CUBE]: new CubeTool(),
  [ToolMode.MEASURE_DISTANCE]: new DistanceMeasureTool(),
};

// Return tools grouped by category for the UI
export const getToolsByCategory = () => {
    const grouped: Record<string, BaseTool[]> = {};
    for (const tool of Object.values(ToolRegistry)) {
        if (!grouped[tool.category]) {
            grouped[tool.category] = [];
        }
        grouped[tool.category].push(tool);
    }
    return grouped;
};