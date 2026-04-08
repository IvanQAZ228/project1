import { AnyNode, NodeType } from '../../types/graph.types';
import { BaseNode } from '../entities/BaseNode';
import { PointNode } from '../entities/PointNode';
import { LineNode } from '../entities/LineNode';
import { PlaneNode } from '../entities/PlaneNode';
import { SolidNode } from '../entities/SolidNode';
import { SectionNode } from '../entities/SectionNode';

export class DAGraph {
  nodes: Record<string, BaseNode> = {};

  // Build the graph from JSON state
  load(stateNodes: Record<string, AnyNode>) {
    this.nodes = {};
    for (const [id, nodeData] of Object.entries(stateNodes)) {
      this.nodes[id] = this.createNodeInstance(nodeData);
    }
  }

  private createNodeInstance(data: AnyNode): BaseNode {
    switch (data.type) {
      case NodeType.POINT: return new PointNode(data);
      case NodeType.LINE: return new LineNode(data);
      case NodeType.PLANE: return new PlaneNode(data);
      case NodeType.SOLID: return new SolidNode(data);
      case NodeType.SECTION: return new SectionNode(data);
      default: throw new Error(`Unknown node type: ${(data as any).type}`);
    }
  }

  // Find all nodes that depend directly or indirectly on the given node IDs
  getDependents(nodeIds: string[]): string[] {
    const dependents = new Set<string>();
    const queue = [...nodeIds];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      for (const [id, node] of Object.entries(this.nodes)) {
        if (node.dependencies.includes(currentId) && !dependents.has(id)) {
          dependents.add(id);
          queue.push(id);
        }
      }
    }
    return Array.from(dependents);
  }

  // Update a node and recompute all its dependents
  updateNode(id: string, updates: Partial<AnyNode>) {
    const node = this.nodes[id];
    if (!node) return;

    // Apply updates
    Object.assign(node, updates);

    // Compute the updated node itself first
    node.compute(this.toStateNodes());

    // Recompute dependents in topological order
    // For MVP, a simple BFS is usually sufficient if graph isn't too deep
    const dependents = this.getDependents([id]);
    const stateNodes = this.toStateNodes();
    for (const depId of dependents) {
      const depNode = this.nodes[depId];
      if (depNode) {
        depNode.compute(stateNodes);
      }
    }
  }

  addNode(data: AnyNode) {
    this.nodes[data.id] = this.createNodeInstance(data);
    this.nodes[data.id].compute(this.toStateNodes());
  }

  removeNode(id: string) {
    const dependents = this.getDependents([id]);
    for (const depId of dependents) {
      delete this.nodes[depId];
    }
    delete this.nodes[id];
  }

  toStateNodes(): Record<string, AnyNode> {
    const result: Record<string, AnyNode> = {};
    for (const [id, node] of Object.entries(this.nodes)) {
      result[id] = node.toJSON();
    }
    return result;
  }
}
