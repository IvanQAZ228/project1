import { BaseTool } from './BaseTool';
import { ToolMode } from '../../types/store.types';
import { Minus } from 'lucide-react';
import { NodeType } from '../../types/graph.types';
import { v4 as uuidv4 } from 'uuid';

export class LineSegmentTool extends BaseTool {
  mode = ToolMode.LINE_SEGMENT;
  label = 'Отрезок (по 2 точкам)';
  category = 'Линии';
  icon = Minus;

  onClick(targetPos: any, targetPointId: any, context: any) {
    if (!targetPointId) return; // For MVP, only create lines between existing/snapped points

    if (context.toolStepData.length === 0) {
      context.setToolStepData([targetPointId]);
    } else if (context.toolStepData[0] !== targetPointId) {
      context.addNode({
        id: uuidv4(),
        type: NodeType.LINE,
        name: `Line ${Object.values(context.nodes).filter((n:any) => n.type === NodeType.LINE).length + 1}`,
        dependencies: [context.toolStepData[0], targetPointId],
        visible: true,
        startPointId: context.toolStepData[0],
        endPointId: targetPointId
      });
      context.setActiveTool(ToolMode.SELECT);
    }
  }
}
