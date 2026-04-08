import { ISectionNode, AnyNode, NodeType, IPlaneNode, ISolidNode } from '../../types/graph.types';
import { IVector3 } from '../../types/geometry.types';
import { BaseNode } from './BaseNode';
import { IntersectionEngine } from '../engine/IntersectionEngine';

export class SectionNode extends BaseNode {
  solidId: string;
  planeId: string;
  intersectionPoints: IVector3[];

  constructor(data: ISectionNode) {
    super(data);
    this.solidId = data.solidId;
    this.planeId = data.planeId;
    this.intersectionPoints = [...data.intersectionPoints];
  }

  compute(graphNodes: Record<string, AnyNode>): void {
    const solid = graphNodes[this.solidId] as ISolidNode;
    const plane = graphNodes[this.planeId] as IPlaneNode;

    if (solid && plane && plane.equation) {
      this.intersectionPoints = IntersectionEngine.calculateSolidPlaneIntersection(solid, plane);
    }
  }

  toJSON(): ISectionNode {
    return {
      id: this.id,
      type: NodeType.SECTION,
      name: this.name,
      parents: this.parents,
      children: this.children,
      visible: this.visible,
      solidId: this.solidId,
      planeId: this.planeId,
      intersectionPoints: this.intersectionPoints
    };
  }
}