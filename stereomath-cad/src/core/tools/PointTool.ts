import { BaseTool } from './BaseTool';
import { ToolMode } from '../../types/store.types';
import { Dot } from 'lucide-react';

import { NodeType } from '../../types/graph.types';
import { v4 as uuidv4 } from 'uuid';

export class PointFreeTool extends BaseTool {
  mode = ToolMode.POINT_FREE;
  label = 'Свободная точка';
  category = 'Точки';
  icon = Dot;

  onClick(targetPos: any, targetPointId: any, context: any) {
    if (targetPointId) {
       // Snapped to existing
       context.setActiveTool(ToolMode.SELECT);
       return;
    }

    if (targetPos) {
       context.addNode({
          id: uuidv4(),
          type: NodeType.POINT,
          name: `Point ${Object.values(context.nodes).filter((n:any) => n.type === NodeType.POINT).length + 1}`,
          dependencies: [],
          visible: true,
          position: { x: targetPos.x, y: targetPos.y, z: targetPos.z }
       });
       context.setActiveTool(ToolMode.SELECT);
    }
  }
}
