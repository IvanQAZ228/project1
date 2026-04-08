import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { ILineNode, IPointNode, NodeType } from '../../../types/graph.types';
import { useGraphStore } from '../../../store/useGraphStore';

interface LineMeshProps {
  node: ILineNode;
}

export const LineMesh = ({ node }: LineMeshProps) => {
  const nodes = useGraphStore(state => state.nodes);
  const selectedNodeIds = useGraphStore(state => state.selectedNodeIds);
  const selectNode = useGraphStore(state => state.selectNode);
  const isSelected = selectedNodeIds.includes(node.id);

  const startPoint = nodes[node.startPointId] as IPointNode;
  const endPoint = nodes[node.endPointId] as IPointNode;

  const points = useMemo(() => {
    if (!startPoint || !endPoint) return null;
    return [
      new THREE.Vector3(startPoint.position.x, startPoint.position.y, startPoint.position.z),
      new THREE.Vector3(endPoint.position.x, endPoint.position.y, endPoint.position.z)
    ];
  }, [startPoint, endPoint]);

  if (!node.visible || !points) return null;

  // We use a tube geometry or standard line. For clickability, Tube is better, but Line is standard.
  // Using Line with a slightly larger invisible tube for raycasting can work, but standard Line is fine for MVP.
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <primitive object={new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: isSelected ? "red" : "black", linewidth: 2 }))}
      onClick={(e: any) => {
        e.stopPropagation();
        selectNode(node.id, e.shiftKey);
      }}
    />
  );
};
