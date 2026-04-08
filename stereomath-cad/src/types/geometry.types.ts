import * as THREE from 'three';

export interface IVector3 {
  x: number;
  y: number;
  z: number;
}

export interface IMatrix4 {
  elements: number[];
}

export type Point3D = THREE.Vector3;
export type Matrix4x4 = THREE.Matrix4;
