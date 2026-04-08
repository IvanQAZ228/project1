import { useMemo } from 'react';
import * as THREE from 'three';
import { ISolidNode } from '../../../types/graph.types';
import { useGraphStore } from '../../../store/useGraphStore';
import { useUIStore } from '../../../store/useUIStore';
import { useToolStore } from '../../../store/useToolStore';
import { RenderMode, ToolMode } from '../../../types/store.types';
import { useSketchMode } from '../../../hooks/useSketchMode';

interface SolidMeshProps {
  node: ISolidNode;
}

export const SolidMesh = ({ node }: SolidMeshProps) => {
  const selectedNodeIds = useGraphStore(state => state.selectedNodeIds);
  const selectNode = useGraphStore(state => state.selectNode);
  const activeTool = useToolStore(state => state.activeTool);
  const { enterSketchMode } = useSketchMode();
  const isSelected = selectedNodeIds.includes(node.id);
  const renderMode = useUIStore(state => state.renderMode);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();

    // Flatten vertices
    const flatVertices = node.vertices.flatMap(v => [v.x, v.y, v.z]);
    geo.setAttribute('position', new THREE.Float32BufferAttribute(flatVertices, 3));

    // Triangulate faces (assuming faces might be polygons, simple fan triangulation)
    const indices: number[] = [];
    for (const face of node.faces) {
      for (let i = 1; i < face.length - 1; i++) {
        indices.push(face[0], face[i], face[i + 1]);
      }
    }
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, [node.vertices, node.faces]);

  const edgesGeometry = useMemo(() => {
    return new THREE.EdgesGeometry(geometry);
  }, [geometry]);

  if (!node.visible) return null;

  const isWireframe = renderMode === RenderMode.WIREFRAME;
  const isSolid = renderMode === RenderMode.SOLID;

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        if (activeTool === ToolMode.SKETCH && e.face) {
            // e.face gives us the normal and we can compute origin from face vertices
            const normal = e.face.normal.clone().transformDirection(new THREE.Matrix4());
            const origin = e.point.clone(); // use click point as local origin for now
            enterSketchMode(node.id, origin, normal);
        } else {
            selectNode(node.id, e.shiftKey);
        }
      }}
    >
      {!isWireframe && (
        <mesh geometry={geometry}>
          <meshStandardMaterial
            color={isSelected ? "#ffcccb" : "#e0e0e0"}
            transparent={!isSolid}
            opacity={isSolid ? 1 : 0.8}
            side={THREE.DoubleSide}
            polygonOffset={true}
            polygonOffsetFactor={1}
            polygonOffsetUnits={1}
          />
        </mesh>
      )}
      {/* Edges */}
      {(!isSolid || isSelected) && (
        <lineSegments geometry={edgesGeometry}>
          <lineBasicMaterial
            color={isSelected ? "red" : "#333333"}
            linewidth={1}
            depthTest={!isWireframe} // In wireframe we might want to see through, but usually solid shows all edges over geometry anyway.
            transparent={isWireframe}
            opacity={isWireframe ? 0.3 : 1}
          />
        </lineSegments>
      )}
      {isWireframe && (
        <lineSegments geometry={edgesGeometry}>
           <lineBasicMaterial color={isSelected ? "red" : "#333333"} depthTest={false} opacity={0.3} transparent={true} />
        </lineSegments>
      )}
      {isWireframe && (
        <lineSegments geometry={edgesGeometry}>
           <lineBasicMaterial color={isSelected ? "red" : "#333333"} depthTest={true} opacity={1} transparent={false} />
        </lineSegments>
      )}
    </group>
  );
};
