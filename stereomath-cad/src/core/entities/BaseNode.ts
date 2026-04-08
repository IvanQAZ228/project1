import { AnyNode, NodeType } from '../../types/graph.types';

export abstract class BaseNode {
  id: string;
  type: NodeType;
  name: string;
  dependencies: string[];
  visible: boolean;

  constructor(data: AnyNode) {
    this.id = data.id;
    this.type = data.type;
    this.name = data.name;
    this.dependencies = data.dependencies || [];
    this.visible = data.visible ?? true;
  }

  // Method to recompute node state based on dependencies
  abstract compute(graphNodes: Record<string, AnyNode>): void;

  // Method to serialize back to store format
  abstract toJSON(): AnyNode;
}