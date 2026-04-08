import { IVector3 } from './geometry.types';

export enum NodeType {
  POINT = 'POINT',
  LINE = 'LINE',
  PLANE = 'PLANE',
  SOLID = 'SOLID',
  SECTION = 'SECTION'
}

export interface IBaseNode {
  id: string;
  type: NodeType;
  name: string;
  dependencies: string[]; // IDs of nodes this node depends on
  visible: boolean;
}

export interface IPointNode extends IBaseNode {
  type: NodeType.POINT;
  position: IVector3;
  isConstrained?: boolean;
}

export interface ILineNode extends IBaseNode {
  type: NodeType.LINE;
  startPointId: string;
  endPointId: string;
}

export interface IPlaneNode extends IBaseNode {
  type: NodeType.PLANE;
  pointIds: string[]; // Usually 3 points to define a plane
  equation?: { a: number, b: number, c: number, d: number };
}

export interface ISolidNode extends IBaseNode {
  type: NodeType.SOLID;
  vertices: IVector3[];
  faces: number[][]; // Indices of vertices for each face
}

export interface ISectionNode extends IBaseNode {
  type: NodeType.SECTION;
  solidId: string;
  planeId: string;
  intersectionPoints: IVector3[];
}

export type AnyNode = IPointNode | ILineNode | IPlaneNode | ISolidNode | ISectionNode;
