import { ISolidNode, AnyNode, NodeType, IPointNode } from '../../types/graph.types';
import { IVector3 } from '../../types/geometry.types';
import { BaseNode } from './BaseNode';

export class SolidNode extends BaseNode {
  vertices: IVector3[];
  faces: number[][];

  constructor(data: ISolidNode) {
    super(data);
    this.vertices = [...data.vertices];
    this.faces = data.faces.map(f => [...f]);
  }

  compute(graphNodes: Record<string, AnyNode>): void {
    // Update vertices if they depend on specific point nodes
    if (this.parents.length > 0) {
        // For our Cube/Pyramid logic, we map dependencies 1:1 to vertices if lengths match
        const pointDeps = this.parents.filter((id: string) => graphNodes[id]?.type === NodeType.POINT);
        if (pointDeps.length === this.vertices.length) {
            for (let i = 0; i < pointDeps.length; i++) {
                const pNode = graphNodes[pointDeps[i]] as IPointNode;
                if (pNode) {
                    this.vertices[i] = { ...pNode.position };
                }
            }
        } else if (pointDeps.length === 1 && this.vertices.length > 1) {
             // Dragging the center point (the only dependency). We need to calculate delta and apply it.
             // This is handled in a more complex setup by the DAG, but for MVP we assume the points
             // themselves were updated.
        }
    }
  }

  toJSON(): ISolidNode {
    return {
      id: this.id,
      type: NodeType.SOLID,
      name: this.name,
      parents: this.parents,
      children: this.children,
      visible: this.visible,
      vertices: this.vertices,
      faces: this.faces
    };
  }
}