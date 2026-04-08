import { describe, it, expect, beforeEach } from 'vitest';
import { DAGraph } from './DAGraph';
import { NodeType, IPointNode, ILineNode } from '../../types/graph.types';

describe('DAGraph', () => {
  let graph: DAGraph;

  beforeEach(() => {
    graph = new DAGraph();
  });

  it('should add points correctly', () => {
    const p1: IPointNode = {
      id: 'p1', type: NodeType.POINT, name: 'P1', dependencies: [], visible: true, position: { x: 0, y: 0, z: 0 }
    };
    graph.addNode(p1);

    expect(graph.nodes['p1']).toBeDefined();
    expect(graph.metadata['p1'].children.size).toBe(0);
  });

  it('should build dependencies (Line from 2 Points)', () => {
    const p1: IPointNode = {
      id: 'p1', type: NodeType.POINT, name: 'P1', dependencies: [], visible: true, position: { x: 0, y: 0, z: 0 }
    };
    const p2: IPointNode = {
      id: 'p2', type: NodeType.POINT, name: 'P2', dependencies: [], visible: true, position: { x: 1, y: 1, z: 1 }
    };
    const line: ILineNode = {
      id: 'l1', type: NodeType.LINE, name: 'L1', dependencies: ['p1', 'p2'], visible: true, startPointId: 'p1', endPointId: 'p2'
    };

    graph.addNode(p1);
    graph.addNode(p2);
    graph.addNode(line);

    expect(graph.metadata['p1'].children.has('l1')).toBe(true);
    expect(graph.metadata['p2'].children.has('l1')).toBe(true);
    expect(graph.metadata['l1'].parents.has('p1')).toBe(true);
    expect(graph.metadata['l1'].parents.has('p2')).toBe(true);
  });

  it('should cascade delete correctly', () => {
    const p1: IPointNode = { id: 'p1', type: NodeType.POINT, name: 'P1', dependencies: [], visible: true, position: { x: 0, y: 0, z: 0 } };
    const p2: IPointNode = { id: 'p2', type: NodeType.POINT, name: 'P2', dependencies: [], visible: true, position: { x: 1, y: 1, z: 1 } };
    const line: ILineNode = { id: 'l1', type: NodeType.LINE, name: 'L1', dependencies: ['p1', 'p2'], visible: true, startPointId: 'p1', endPointId: 'p2' };

    graph.addNode(p1);
    graph.addNode(p2);
    graph.addNode(line);

    // Deleting p1 should cascade and delete l1. p2 should remain.
    graph.removeNode('p1');

    expect(graph.nodes['p1']).toBeUndefined();
    expect(graph.nodes['l1']).toBeUndefined(); // Cascade deleted
    expect(graph.nodes['p2']).toBeDefined(); // Still exists

    // p2 metadata should no longer list l1 as child
    expect(graph.metadata['p2'].children.has('l1')).toBe(false);
  });
});