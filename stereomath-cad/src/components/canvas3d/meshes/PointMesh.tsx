import { useRef } from 'react';
import { IPointNode } from '../../../types/graph.types';
import { useGraphStore } from '../../../store/useGraphStore';
import { useDragPoint } from '../../../hooks/useDragPoint';
import * as THREE from 'three';

interface PointMeshProps {
  node: IPointNode;
}

export const PointMesh = ({ node }: PointMeshProps) => {
  const selectedNodeIds = useGraphStore(state => state.selectedNodeIds);
  const selectNode = useGraphStore(state => state.selectNode);
  const isSelected = selectedNodeIds.includes(node.id);

  const meshRef = useRef<THREE.Mesh>(null);
  const { onPointerDown, onPointerUp } = useDragPoint(meshRef);

  if (!node.visible) return null;

  return (
    <mesh
      ref={meshRef}
      position={[node.position.x, node.position.y, node.position.z]}
      onClick={(e) => {
        e.stopPropagation();
        selectNode(node.id, e.shiftKey);
      }}
      onPointerDown={(e) => onPointerDown(e, node.id)}
      onPointerUp={onPointerUp}
      onPointerOut={onPointerUp} // Safety to stop dragging if pointer leaves mesh wildly
    >
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial color={isSelected ? "red" : "black"} />
    </mesh>
  );
};
