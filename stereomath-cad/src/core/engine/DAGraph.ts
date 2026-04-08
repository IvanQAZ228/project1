import { AnyNode, NodeType } from '../../types/graph.types';
import { BaseNode } from '../entities/BaseNode';
import { PointNode } from '../entities/PointNode';
import { LineNode } from '../entities/LineNode';
import { PlaneNode } from '../entities/PlaneNode';
import { SolidNode } from '../entities/SolidNode';
import { SectionNode } from '../entities/SectionNode';

interface DAGMetadata {
  parents: Set<string>;
  children: Set<string>;
}

export class DAGraph {
  nodes: Record<string, BaseNode> = {};
  metadata: Record<string, DAGMetadata> = {};

  // Build the graph from JSON state
  load(stateNodes: Record<string, AnyNode>) {
    this.nodes = {};
    this.metadata = {};

    // First pass: create all instances
    for (const [id, nodeData] of Object.entries(stateNodes)) {
      this.nodes[id] = this.createNodeInstance(nodeData);
      this.metadata[id] = { parents: new Set(), children: new Set() };
    }

    // Second pass: build relationships (parents/children)
    for (const [id, node] of Object.entries(this.nodes)) {
      for (const depId of node.dependencies) {
         if (this.nodes[depId]) {
             this.metadata[id].parents.add(depId);
             this.metadata[depId].children.add(id);
         }
      }
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
      const children = this.metadata[currentId]?.children || new Set();

      for (const childId of children) {
          if (!dependents.has(childId)) {
              dependents.add(childId);
              queue.push(childId);
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

    // If dependencies changed, we need to rebuild the metadata for this node
    if (updates.dependencies) {
       // Remove old parent links
       const oldParents = this.metadata[id].parents;
       for (const oldP of oldParents) {
           if (this.metadata[oldP]) {
               this.metadata[oldP].children.delete(id);
           }
       }

       this.metadata[id].parents = new Set();
       for (const newP of updates.dependencies) {
           if (this.nodes[newP]) {
               this.metadata[id].parents.add(newP);
               if (this.metadata[newP]) {
                   this.metadata[newP].children.add(id);
               }
           }
       }
    }

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
    this.metadata[data.id] = { parents: new Set(), children: new Set() };

    // Add parent/child relationships
    for (const depId of data.dependencies || []) {
        if (this.nodes[depId]) {
            this.metadata[data.id].parents.add(depId);
            this.metadata[depId].children.add(data.id);
        }
    }

    this.nodes[data.id].compute(this.toStateNodes());
  }

  // Recursive cascade deletion
  removeNode(id: string) {
    if (!this.nodes[id]) return;

    // We must recursively delete children first
    const children = Array.from(this.metadata[id]?.children || []);
    for (const childId of children) {
        this.removeNode(childId);
    }

    // After children are removed, clean up parent's links to this node
    const parents = this.metadata[id]?.parents || new Set();
    for (const parentId of parents) {
        if (this.metadata[parentId]) {
            this.metadata[parentId].children.delete(id);
        }
    }

    // Finally, remove the node itself
    delete this.metadata[id];
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
