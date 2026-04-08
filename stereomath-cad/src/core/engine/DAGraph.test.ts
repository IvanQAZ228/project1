import { describe, it, expect, beforeEach } from 'vitest';
import { DAGraph } from './DAGraph';
import { NodeType, IPointNode, ILineNode } from '../../types/graph.types';

describe('DAGraph Cascade Deletion', () => {
  let graph: DAGraph;

  beforeEach(() => {
    graph = new DAGraph();
  });

  it('should create independent points and link them with a line', () => {
    const pointA: IPointNode = {
      id: 'point_a',
      type: NodeType.POINT,
      name: 'Point A',
      parents: [],
      children: [],
      visible: true,
      position: { x: 0, y: 0, z: 0 }
    };

    const pointB: IPointNode = {
      id: 'point_b',
      type: NodeType.POINT,
      name: 'Point B',
      parents: [],
      children: [],
      visible: true,
      position: { x: 10, y: 10, z: 10 }
    };

    graph.addNode(pointA);
    graph.addNode(pointB);

    expect(graph.nodes['point_a']).toBeDefined();
    expect(graph.nodes['point_b']).toBeDefined();

    const lineAB: ILineNode = {
      id: 'line_ab',
      type: NodeType.LINE,
      name: 'Line AB',
      parents: ['point_a', 'point_b'],
      children: [],
      visible: true,
      startPointId: 'point_a',
      endPointId: 'point_b'
    };

    graph.addNode(lineAB);

    expect(graph.nodes['line_ab']).toBeDefined();
    expect(graph.nodes['point_a'].children).toContain('line_ab');
    expect(graph.nodes['point_b'].children).toContain('line_ab');
  });

  it('should cascade delete a dependent line when a parent point is deleted', () => {
    // Setup
    graph.addNode({
      id: 'p1', type: NodeType.POINT, name: 'P1', parents: [], children: [], visible: true, position: { x: 0, y: 0, z: 0 }
    });
    graph.addNode({
      id: 'p2', type: NodeType.POINT, name: 'P2', parents: [], children: [], visible: true, position: { x: 1, y: 1, z: 1 }
    });
    graph.addNode({
      id: 'l1', type: NodeType.LINE, name: 'L1', parents: ['p1', 'p2'], children: [], visible: true, startPointId: 'p1', endPointId: 'p2'
    });

    // Ensure state before deletion
    expect(graph.nodes['l1']).toBeDefined();
    expect(graph.nodes['p1'].children).toContain('l1');

    // Action: Delete P1
    const deletedIds = graph.cascadeDelete('p1');

    // Assertions
    expect(deletedIds).toContain('p1');
    expect(deletedIds).toContain('l1'); // Line should be deleted
    expect(deletedIds).not.toContain('p2'); // Other point should remain

    expect(graph.nodes['p1']).toBeUndefined();
    expect(graph.nodes['l1']).toBeUndefined();
    expect(graph.nodes['p2']).toBeDefined(); // Surviving node

    // The surviving node's children should be updated (l1 should be removed from p2's children)
    expect(graph.nodes['p2'].children).not.toContain('l1');
  });

  it('should handle deep cascade deletion', () => {
    // P1 -> L1 -> P_Mid -> L2 -> Plane
    // If P1 is deleted, everything in the chain should be deleted.
    graph.addNode({ id: 'p1', type: NodeType.POINT, name: 'P1', parents: [], children: [], visible: true, position: { x: 0, y: 0, z: 0 } });
    graph.addNode({ id: 'p2', type: NodeType.POINT, name: 'P2', parents: [], children: [], visible: true, position: { x: 2, y: 0, z: 0 } });
    graph.addNode({ id: 'l1', type: NodeType.LINE, name: 'L1', parents: ['p1', 'p2'], children: [], visible: true, startPointId: 'p1', endPointId: 'p2' });
    graph.addNode({ id: 'pmid', type: NodeType.POINT, name: 'PMid', parents: ['l1'], children: [], visible: true, position: { x: 1, y: 0, z: 0 }, isConstrained: true });
    graph.addNode({ id: 'p3', type: NodeType.POINT, name: 'P3', parents: [], children: [], visible: true, position: { x: 0, y: 2, z: 0 } });
    graph.addNode({ id: 'l2', type: NodeType.LINE, name: 'L2', parents: ['pmid', 'p3'], children: [], visible: true, startPointId: 'pmid', endPointId: 'p3' });

    expect(graph.nodes['l2']).toBeDefined();

    const deletedIds = graph.cascadeDelete('p1');

    expect(deletedIds).toContain('p1');
    expect(deletedIds).toContain('l1');
    expect(deletedIds).toContain('pmid');
    expect(deletedIds).toContain('l2');

    expect(deletedIds).not.toContain('p2');
    expect(deletedIds).not.toContain('p3');

    expect(graph.nodes['p1']).toBeUndefined();
    expect(graph.nodes['l1']).toBeUndefined();
    expect(graph.nodes['pmid']).toBeUndefined();
    expect(graph.nodes['l2']).toBeUndefined();

    expect(graph.nodes['p2']).toBeDefined();
    expect(graph.nodes['p3']).toBeDefined();

    expect(graph.nodes['p2'].children).toEqual([]);
    expect(graph.nodes['p3'].children).toEqual([]);
  });
});