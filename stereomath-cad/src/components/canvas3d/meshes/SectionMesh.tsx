import { useMemo } from 'react';
import * as THREE from 'three';
import { ISectionNode } from '../../../types/graph.types';
import { useGraphStore } from '../../../store/useGraphStore';

interface SectionMeshProps {
  node: ISectionNode;
}

export const SectionMesh = ({ node }: SectionMeshProps) => {
  const selectedNodeIds = useGraphStore(state => state.selectedNodeIds);
  const selectNode = useGraphStore(state => state.selectNode);
  const isSelected = selectedNodeIds.includes(node.id);

  const geometry = useMemo(() => {
    if (!node.intersectionPoints || node.intersectionPoints.length < 3) return null;

    const geo = new THREE.BufferGeometry();
    const flatVertices = node.intersectionPoints.flatMap(v => [v.x, v.y, v.z]);
    geo.setAttribute('position', new THREE.Float32BufferAttribute(flatVertices, 3));

    // Triangle fan from first point (assuming sorted convex polygon)
    const indices: number[] = [];
    for (let i = 1; i < node.intersectionPoints.length - 1; i++) {
      indices.push(0, i, i + 1);
    }
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, [node.intersectionPoints]);

  const edgesGeometry = useMemo(() => {
    if (!geometry) return null;
    return new THREE.EdgesGeometry(geometry);
  }, [geometry]);

  if (!node.visible || !geometry) return null;

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        selectNode(node.id, e.shiftKey);
      }}
    >
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color={isSelected ? "#ffaa00" : "#00aaff"}
          transparent={true}
          opacity={0.6}
          side={THREE.DoubleSide}
          polygonOffset={true}
          polygonOffsetFactor={-1} // Negative offset to push it towards camera slightly and avoid z-fighting
          polygonOffsetUnits={-1}
          depthWrite={false}
        />
      </mesh>
      {edgesGeometry && (
        <lineSegments geometry={edgesGeometry}>
           <lineBasicMaterial color={isSelected ? "red" : "#0044ff"} linewidth={2} />
        </lineSegments>
      )}
    </group>
  );
};
