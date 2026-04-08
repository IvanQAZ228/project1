import { BaseTool } from './BaseTool';
import { ToolMode } from '../../types/store.types';
import { Box } from 'lucide-react';
import { NodeType } from '../../types/graph.types';
import { v4 as uuidv4 } from 'uuid';

export class CubeTool extends BaseTool {
  mode = ToolMode.SOLID_CUBE;
  label = 'Куб (по центру)';
  category = '3D Фигуры';
  icon = Box;

  onClick(targetPos: any, targetPointId: any, context: any) {
    if (!targetPointId || !targetPos) return;

    const size = 2;
    const half = size / 2;
    const vIds: string[] = [];

    // Create 8 vertices
    for (let i = 0; i < 8; i++) {
        const vx = targetPos.x + (i & 1 ? half : -half);
        const vy = targetPos.y + (i & 2 ? half : -half) + half; // Base on ground if target is on ground
        const vz = targetPos.z + (i & 4 ? half : -half);

        const vid = uuidv4();
        vIds.push(vid);
        context.addNode({
            id: vid,
            type: NodeType.POINT,
            name: `CVertex ${i+1}`,
            dependencies: [targetPointId],
            visible: true,
            position: { x: vx, y: vy, z: vz },
            isConstrained: true // For MVP, tie to center
        });
    }

    // Add Cube Solid Node
    context.addNode({
        id: uuidv4(),
        type: NodeType.SOLID,
        name: `Cube ${Object.values(context.nodes).filter((n:any) => n.type === NodeType.SOLID).length + 1}`,
        dependencies: vIds,
        visible: true,
        vertices: vIds.map(id => (context.nodes[id])?.position || {x:0, y:0, z:0}),
        faces: [
            [0, 1, 3, 2], // Bottom
            [4, 5, 7, 6], // Top
            [0, 1, 5, 4], // Front
            [2, 3, 7, 6], // Back
            [0, 2, 6, 4], // Left
            [1, 3, 7, 5]  // Right
        ]
    });
    context.setActiveTool(ToolMode.SELECT);
  }
}
