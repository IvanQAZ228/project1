import { IPointNode, AnyNode, NodeType } from '../../types/graph.types';
import { IVector3 } from '../../types/geometry.types';
import { BaseNode } from './BaseNode';

export class PointNode extends BaseNode {
  position: IVector3;
  isConstrained?: boolean;

  constructor(data: IPointNode) {
    super(data);
    this.position = { ...data.position };
    this.isConstrained = data.isConstrained;
  }

  compute(graphNodes: Record<string, AnyNode>): void {
    // Basic points don't depend on others unless they are constrained (e.g. to line/face)
    // For MVP, points are mostly independent roots.
  }

  toJSON(): IPointNode {
    return {
      id: this.id,
      type: NodeType.POINT,
      name: this.name,
      parents: this.parents,
      children: this.children,
      visible: this.visible,
      position: this.position,
      isConstrained: this.isConstrained
    };
  }
}