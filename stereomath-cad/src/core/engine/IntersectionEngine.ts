import * as THREE from 'three';
import { ISolidNode, IPlaneNode } from '../../types/graph.types';
import { IVector3 } from '../../types/geometry.types';
import { isEqual, isZero } from '../../utils/mathUtils';

export class IntersectionEngine {

  static calculateSolidPlaneIntersection(solid: ISolidNode, planeNode: IPlaneNode): IVector3[] {
    if (!planeNode.equation) return [];

    const plane = new THREE.Plane(
      new THREE.Vector3(planeNode.equation.a, planeNode.equation.b, planeNode.equation.c),
      planeNode.equation.d
    );

    const intersectionPoints: THREE.Vector3[] = [];
    const edges = this.getUniqueEdges(solid.faces);

    // 1. Find all intersection points of edges with the plane
    for (const edge of edges) {
      const v1 = solid.vertices[edge[0]];
      const v2 = solid.vertices[edge[1]];
      const p1 = new THREE.Vector3(v1.x, v1.y, v1.z);
      const p2 = new THREE.Vector3(v2.x, v2.y, v2.z);

      const d1 = plane.distanceToPoint(p1);
      const d2 = plane.distanceToPoint(p2);

      // Check if edge intersects plane (signs are different or one is exactly on plane)
      if (d1 * d2 < 0 || isZero(d1) || isZero(d2)) {
        const line = new THREE.Line3(p1, p2);
        const intersect = new THREE.Vector3();
        if (plane.intersectLine(line, intersect)) {
          // Avoid duplicate points (due to shared edges/vertices)
          if (!this.containsPoint(intersectionPoints, intersect)) {
            intersectionPoints.push(intersect);
          }
        }
      }
    }

    if (intersectionPoints.length < 3) return [];

    // 2. Sort points to form a convex polygon (counter-clockwise)
    return this.sortPointsCCW(intersectionPoints, plane.normal).map(p => ({ x: p.x, y: p.y, z: p.z }));
  }

  private static getUniqueEdges(faces: number[][]): number[][] {
    const edges: Record<string, number[]> = {};
    for (const face of faces) {
      for (let i = 0; i < face.length; i++) {
        const i1 = face[i];
        const i2 = face[(i + 1) % face.length];
        const key = i1 < i2 ? `${i1}-${i2}` : `${i2}-${i1}`;
        edges[key] = [i1, i2];
      }
    }
    return Object.values(edges);
  }

  private static containsPoint(points: THREE.Vector3[], point: THREE.Vector3): boolean {
    for (const p of points) {
      if (isEqual(p.distanceTo(point), 0)) return true;
    }
    return false;
  }

  private static sortPointsCCW(points: THREE.Vector3[], normal: THREE.Vector3): THREE.Vector3[] {
    // Find centroid
    const centroid = new THREE.Vector3();
    for (const p of points) centroid.add(p);
    centroid.divideScalar(points.length);

    // Create local basis on the plane to calculate angles
    let uDir = new THREE.Vector3(1, 0, 0);
    if (Math.abs(normal.dot(uDir)) > 0.99) uDir.set(0, 1, 0);
    uDir.crossVectors(uDir, normal).normalize();
    const vDir = new THREE.Vector3().crossVectors(normal, uDir).normalize();

    // Sort by angle atan2
    return points.sort((a, b) => {
      const va = new THREE.Vector3().subVectors(a, centroid);
      const vb = new THREE.Vector3().subVectors(b, centroid);
      const angleA = Math.atan2(va.dot(vDir), va.dot(uDir));
      const angleB = Math.atan2(vb.dot(vDir), vb.dot(uDir));
      return angleA - angleB;
    });
  }
}