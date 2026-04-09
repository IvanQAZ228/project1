import { BaseTool } from './BaseTool';
import { ToolMode } from '../../types/store.types';
import { Search } from 'lucide-react';

export class DistanceMeasureTool extends BaseTool {
  mode = ToolMode.MEASURE_DISTANCE;
  label = 'Измерение расстояния';
  category = 'Измерения';
  icon = Search;

  onClick(targetPos: any, targetPointId: any, context: any) {
      // In a full implementation, this might select two points and create a measurement line
      // For now, let's just fall back to select mode.
      context.setActiveTool(ToolMode.SELECT);
  }
}
