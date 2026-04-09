import { IPlaneNode, AnyNode, NodeType, IPointNode } from '../../types/graph.types';
import { BaseNode } from './BaseNode';
import * as THREE from 'three';

export class PlaneNode extends BaseNode {
  pointIds: string[];
  equation?: { a: number, b: number, c: number, d: number };

  constructor(data: IPlaneNode) {
    super(data);
    this.pointIds = [...data.pointIds];
    this.equation = data.equation ? { ...data.equation } : undefined;
  }

  compute(graphNodes: Record<string, AnyNode>): void {
    if (this.pointIds.length >= 3) {
      const p1Node = graphNodes[this.pointIds[0]] as IPointNode;
      const p2Node = graphNodes[this.pointIds[1]] as IPointNode;
      const p3Node = graphNodes[this.pointIds[2]] as IPointNode;

      if (p1Node && p2Node && p3Node) {
        const v1 = new THREE.Vector3(p1Node.position.x, p1Node.position.y, p1Node.position.z);
        const v2 = new THREE.Vector3(p2Node.position.x, p2Node.position.y, p2Node.position.z);
        const v3 = new THREE.Vector3(p3Node.position.x, p3Node.position.y, p3Node.position.z);

        const plane = new THREE.Plane().setFromCoplanarPoints(v1, v2, v3);
        this.equation = {
          a: plane.normal.x,
          b: plane.normal.y,
          c: plane.normal.z,
          d: plane.constant
        };
      }
    }
  }

  toJSON(): IPlaneNode {
    return {
      id: this.id,
      type: NodeType.PLANE,
      name: this.name,
      parents: this.parents,
      visible: this.visible,
      pointIds: this.pointIds,
      equation: this.equation
    };
  }
}