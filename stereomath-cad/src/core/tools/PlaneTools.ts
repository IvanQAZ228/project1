import { BaseTool } from './BaseTool';
import { ToolMode } from '../../types/store.types';
import { Layers } from 'lucide-react';
import { NodeType } from '../../types/graph.types';
import { v4 as uuidv4 } from 'uuid';

export class PlaneBy3PointsTool extends BaseTool {
  mode = ToolMode.PLANE_BY_3_POINTS;
  label = 'Плоскость по 3 точкам';
  category = 'Плоскости';
  icon = Layers;

  onClick(targetPos: any, targetPointId: any, context: any) {
    if (!targetPointId) return;

    if (context.toolStepData.length < 2) {
        context.setToolStepData([...context.toolStepData, targetPointId]);
    } else {
        const p1 = context.toolStepData[0];
        const p2 = context.toolStepData[1];
        const p3 = targetPointId;

        if (p1 !== p2 && p2 !== p3 && p1 !== p3) {
            const planeId = uuidv4();
            context.addNode({
                id: planeId,
                type: NodeType.PLANE,
                name: `Plane ${Object.values(context.nodes).filter((n:any) => n.type === NodeType.PLANE).length + 1}`,
                dependencies: [p1, p2, p3],
                visible: true,
                pointIds: [p1, p2, p3]
            });
        }
        context.setActiveTool(ToolMode.SELECT);
    }
  }
}
