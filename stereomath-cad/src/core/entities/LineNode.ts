import { ILineNode, AnyNode, NodeType, IPointNode } from '../../types/graph.types';
import { BaseNode } from './BaseNode';

export class LineNode extends BaseNode {
  startPointId: string;
  endPointId: string;

  constructor(data: ILineNode) {
    super(data);
    this.startPointId = data.startPointId;
    this.endPointId = data.endPointId;
  }

  compute(graphNodes: Record<string, AnyNode>): void {
    // Lines depend on start and end points
    const p1 = graphNodes[this.startPointId] as IPointNode;
    const p2 = graphNodes[this.endPointId] as IPointNode;
    if (!p1 || !p2) {
      console.warn(`Line ${this.id} missing points`);
    }
  }

  toJSON(): ILineNode {
    return {
      id: this.id,
      type: NodeType.LINE,
      name: this.name,
      parents: this.parents,
      children: this.children,
      visible: this.visible,
      startPointId: this.startPointId,
      endPointId: this.endPointId
    };
  }
}