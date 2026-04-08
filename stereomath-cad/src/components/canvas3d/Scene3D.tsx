import { Canvas, useThree } from '@react-three/fiber';
import { CameraManager } from './CameraManager';
import { Grid3D } from './Grid3D';
import { useGraphStore } from '../../store/useGraphStore';
import { useToolStore } from '../../store/useToolStore';
import { NodeType, IPointNode, ILineNode, ISolidNode, ISectionNode, IPlaneNode } from '../../types/graph.types';
import { PointMesh } from './meshes/PointMesh';
import { LineMesh } from './meshes/LineMesh';
import { SolidMesh } from './meshes/SolidMesh';
import { SectionMesh } from './meshes/SectionMesh';
import { ToolMode } from '../../types/store.types';
import * as THREE from 'three';
import { SnappingEngine } from '../../core/engine/SnappingEngine';
import { v4 as uuidv4 } from 'uuid';

const SceneContent = () => {
  const nodes = useGraphStore(state => state.nodes);
  const addNode = useGraphStore(state => state.addNode);
  const clearSelection = useGraphStore(state => state.clearSelection);
  const activeTool = useToolStore(state => state.activeTool);
  const { camera, raycaster, pointer } = useThree();
  const toolStepData = useToolStore(state => state.toolStepData);
  const setToolStepData = useToolStore(state => state.setToolStepData);
  const setActiveTool = useToolStore(state => state.setActiveTool);

  const handleCanvasClick = (e: any) => {
    if (activeTool === ToolMode.SELECT) {
        if (e.delta > 2) return;
        clearSelection();
        return;
    }

    // Dynamic Tool Dispatcher
    import('../../core/tools/ToolRegistry').then(({ ToolRegistry }) => {
        const tool = ToolRegistry[activeTool];
        if (!tool) return;

        raycaster.setFromCamera(pointer, camera);
        const snappedPoint = SnappingEngine.findClosestPoint(raycaster, nodes);
        let targetPointId = snappedPoint?.id;
        let targetPos = snappedPoint ? new THREE.Vector3(snappedPoint.position.x, snappedPoint.position.y, snappedPoint.position.z) : null;

        // If tool expects a point but we clicked empty space, let's see if we should create a free point first
        // For MVP, we pass nulls and let the tool decide, but we provide standard ground plane intersection
        if (!targetPos) {
             const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
             targetPos = new THREE.Vector3();
             raycaster.ray.intersectPlane(plane, targetPos);
        }

        tool.onClick(targetPos, targetPointId, {
            nodes,
            addNode,
            toolStepData,
            setToolStepData,
            setActiveTool
        });
    });
  };

  return (
    <>
      <color attach="background" args={['#f8fafc']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />

      <CameraManager />
      <Grid3D />

      <mesh
        position={[0,0,0]}
        rotation={[-Math.PI/2, 0, 0]}
        visible={false}
        onPointerUp={handleCanvasClick}
      >
        <planeGeometry args={[1000, 1000]} />
      </mesh>

      {Object.values(nodes).map(node => {
        if (node.type === NodeType.POINT) return <PointMesh key={node.id} node={node as IPointNode} />;
        if (node.type === NodeType.LINE) return <LineMesh key={node.id} node={node as ILineNode} />;
        if (node.type === NodeType.SOLID) return <SolidMesh key={node.id} node={node as ISolidNode} />;
        if (node.type === NodeType.SECTION) return <SectionMesh key={node.id} node={node as ISectionNode} />;
        return null;
      })}
    </>
  );
};

export const Scene3D = () => {
  return (
    <div className="w-full h-full">
      <Canvas>
        <SceneContent />
      </Canvas>
    </div>
  );
};
