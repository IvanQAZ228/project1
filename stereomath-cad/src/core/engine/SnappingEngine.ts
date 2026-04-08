import * as THREE from 'three';
import { AnyNode, NodeType, IPointNode } from '../../types/graph.types';

export class SnappingEngine {
  static SNAP_RADIUS = 0.5; // distance in 3D units, or can be projected to screen space

  // Find the closest point within SNAP_RADIUS
  static findClosestPoint(
    raycaster: THREE.Raycaster,
    nodes: Record<string, AnyNode>
  ): IPointNode | null {
    let closestPoint: IPointNode | null = null;
    let minDistance = Infinity;

    // Use a small mathematical sphere/distance check instead of actual Three.js Meshes
    // to keep it decoupled from the React rendering layer.

    // ray line
    const ray = raycaster.ray;

    for (const node of Object.values(nodes)) {
      if (node.type === NodeType.POINT && node.visible) {
        const p = new THREE.Vector3(node.position.x, node.position.y, node.position.z);
        // Distance from point to ray
        const distSq = ray.distanceSqToPoint(p);

        if (distSq < this.SNAP_RADIUS * this.SNAP_RADIUS) {
            // Also need to check if it's in front of camera
            // Distance from ray origin to projected point on ray
            const projected = new THREE.Vector3();
            ray.closestPointToPoint(p, projected);
            const distToCam = ray.origin.distanceTo(projected);

            if (distToCam < minDistance) {
              minDistance = distToCam;
              closestPoint = node as IPointNode;
            }
        }
      }
    }

    return closestPoint;
  }
}
