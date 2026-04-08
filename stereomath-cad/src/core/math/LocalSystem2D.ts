import * as THREE from 'three';

export class LocalSystem2D {
  origin: THREE.Vector3;
  uDir: THREE.Vector3;
  vDir: THREE.Vector3;
  normal: THREE.Vector3;
  matrix: THREE.Matrix4;
  inverseMatrix: THREE.Matrix4;

  constructor(origin: THREE.Vector3, normal: THREE.Vector3) {
    this.origin = origin.clone();
    this.normal = normal.clone().normalize();

    // Find a valid U direction perpendicular to normal
    // We can pick an arbitrary vector not collinear with normal, e.g., (1,0,0) or (0,1,0)
    let temp = new THREE.Vector3(1, 0, 0);
    if (Math.abs(this.normal.dot(temp)) > 0.99) {
      temp.set(0, 1, 0);
    }

    this.uDir = new THREE.Vector3().crossVectors(temp, this.normal).normalize();
    this.vDir = new THREE.Vector3().crossVectors(this.normal, this.uDir).normalize();

    this.matrix = new THREE.Matrix4().makeBasis(this.uDir, this.vDir, this.normal);
    this.matrix.setPosition(this.origin);

    this.inverseMatrix = this.matrix.clone().invert();
  }

  // Convert 3D world coordinates to local 2D (u,v) on the plane
  projectTo2D(point3D: THREE.Vector3): THREE.Vector2 {
    const localPoint = point3D.clone().applyMatrix4(this.inverseMatrix);
    return new THREE.Vector2(localPoint.x, localPoint.y); // Drop z since it should be ~0
  }

  // Convert local 2D (u,v) back to 3D world coordinates
  unprojectTo3D(u: number, v: number): THREE.Vector3 {
    const localPoint = new THREE.Vector3(u, v, 0);
    return localPoint.applyMatrix4(this.matrix);
  }
}
