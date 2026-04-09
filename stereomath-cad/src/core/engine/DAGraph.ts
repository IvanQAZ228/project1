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

    // Create all instances
    for (const [id, nodeData] of Object.entries(stateNodes)) {
      this.nodes[id] = this.createNodeInstance(nodeData);
    }

    // Safety check: ensure graph consistency for children/parents
    for (const [id, node] of Object.entries(this.nodes)) {
      // Re-verify that parents exist
      node.parents = node.parents.filter(pId => this.nodes[pId] !== undefined);
      // Re-verify that children exist
      node.children = node.children.filter(cId => this.nodes[cId] !== undefined);
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
        if (node.parents.includes(currentId) && !dependents.has(id)) {
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

    // Save previous parents to detect changes
    const oldParents = [...node.parents];

    // Apply updates
    Object.assign(node, updates);

    // If parents changed, we need to rebuild relationships
    if (updates.parents) {
       // Remove node from children array of old parents
       for (const oldPId of oldParents) {
           const oldParentNode = this.nodes[oldPId];
           if (oldParentNode) {
               oldParentNode.children = oldParentNode.children.filter(cId => cId !== id);
           }
       }

       node.parents = [...updates.parents];
       for (const newPId of node.parents) {
           const newParentNode = this.nodes[newPId];
           if (newParentNode) {
               if (!newParentNode.children.includes(id)) {
                 newParentNode.children.push(id);
               }
           }
       }
    }

    // Compute the updated node itself first
    node.compute(this.toStateNodes());

    // Recompute dependents in topological order
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
    const newNode = this.createNodeInstance(data);
    this.nodes[data.id] = newNode;

    // Link parents to this new child
    for (const pId of newNode.parents) {
        const parentNode = this.nodes[pId];
        if (parentNode) {
            if (!parentNode.children.includes(newNode.id)) {
                parentNode.children.push(newNode.id);
            }
        }
    }

    newNode.compute(this.toStateNodes());
  }

  /**
   * Recursively deletes a node and all its dependents.
   * Returns an array of the IDs of all deleted nodes.
   */
  cascadeDelete(id: string): string[] {
    const deletedIds: string[] = [];

    const deleteRecursively = (nodeId: string) => {
      const node = this.nodes[nodeId];
      if (!node) return;

      // 1. Delete all children first
      const childrenToProcess = [...node.children];
      for (const childId of childrenToProcess) {
          deleteRecursively(childId);
      }

      // Ensure node wasn't already deleted during a previous recursive step
      if (!this.nodes[nodeId]) return;

      // 2. Remove this node from its parents' children array
      for (const parentId of node.parents) {
          const parentNode = this.nodes[parentId];
          if (parentNode) {
              parentNode.children = parentNode.children.filter(cId => cId !== nodeId);
          }
      }

      // 3. Delete the node itself
      delete this.nodes[nodeId];
      deletedIds.push(nodeId);
    };

    deleteRecursively(id);
    return deletedIds;
  }

  toStateNodes(): Record<string, AnyNode> {
    const result: Record<string, AnyNode> = {};
    for (const [id, node] of Object.entries(this.nodes)) {
      result[id] = node.toJSON();
    }
    return result;
  }
}
