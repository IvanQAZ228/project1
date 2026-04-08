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

    raycaster.setFromCamera(pointer, camera);
    const snappedPoint = SnappingEngine.findClosestPoint(raycaster, nodes);
    let targetPointId = snappedPoint?.id;
    let targetPos = snappedPoint ? new THREE.Vector3(snappedPoint.position.x, snappedPoint.position.y, snappedPoint.position.z) : null;

    if (!targetPointId) {
      // Create a new free point on the ground plane
      const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      targetPos = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, targetPos);

      if (targetPos) {
        targetPointId = uuidv4();
        addNode({
          id: targetPointId,
          type: NodeType.POINT,
          name: `Point ${Object.values(nodes).filter(n => n.type === NodeType.POINT).length + 1}`,
          dependencies: [],
          visible: true,
          position: { x: targetPos.x, y: targetPos.y, z: targetPos.z }
        });
      }
    }

    if (!targetPointId || !targetPos) return;

    if (activeTool === ToolMode.POINT) {
      // Handled above (snapping or creating)
      setActiveTool(ToolMode.SELECT);
    }
    else if (activeTool === ToolMode.LINE) {
      if (toolStepData.length === 0) {
        setToolStepData([targetPointId]);
      } else if (toolStepData[0] !== targetPointId) {
        addNode({
          id: uuidv4(),
          type: NodeType.LINE,
          name: `Line ${Object.values(nodes).filter(n => n.type === NodeType.LINE).length + 1}`,
          dependencies: [toolStepData[0], targetPointId],
          visible: true,
          startPointId: toolStepData[0],
          endPointId: targetPointId
        });
        setActiveTool(ToolMode.SELECT);
      }
    }
    else if (activeTool === ToolMode.PYRAMID) {
        // Create a basic square pyramid from a single point as base center
        const size = 2;
        const height = 3;
        const half = size / 2;
        const vIds: string[] = [];

        // Create 4 base vertices
        for (let i = 0; i < 4; i++) {
            const vx = targetPos.x + (i === 0 || i === 3 ? -half : half);
            const vy = targetPos.y;
            const vz = targetPos.z + (i === 0 || i === 1 ? -half : half);

            const vid = uuidv4();
            vIds.push(vid);
            addNode({
                id: vid,
                type: NodeType.POINT,
                name: `PVertex ${i+1}`,
                dependencies: [targetPointId],
                visible: true,
                position: { x: vx, y: vy, z: vz },
                isConstrained: true
            });
        }

        // Apex vertex
        const apexId = uuidv4();
        vIds.push(apexId);
        addNode({
            id: apexId,
            type: NodeType.POINT,
            name: `PApex`,
            dependencies: [targetPointId],
            visible: true,
            position: { x: targetPos.x, y: targetPos.y + height, z: targetPos.z },
            isConstrained: true
        });

        // Add Pyramid Solid Node
        addNode({
            id: uuidv4(),
            type: NodeType.SOLID,
            name: `Pyramid ${Object.values(nodes).filter(n => n.type === NodeType.SOLID).length + 1}`,
            dependencies: vIds,
            visible: true,
            vertices: vIds.map(id => (nodes[id] as IPointNode)?.position || {x:0, y:0, z:0}),
            faces: [
                [0, 3, 2, 1], // Base (CCW from bottom)
                [0, 1, 4],    // Side 1
                [1, 2, 4],    // Side 2
                [2, 3, 4],    // Side 3
                [3, 0, 4]     // Side 4
            ]
        });
        setActiveTool(ToolMode.SELECT);
    }
    else if (activeTool === ToolMode.CUBE) {
        // Create a basic cube from a single point as center
        const size = 2;
        const half = size / 2;
        const vIds: string[] = [];

        // Create 8 vertices
        for (let i = 0; i < 8; i++) {
            const vx = targetPos.x + (i & 1 ? half : -half);
            const vy = targetPos.y + (i & 2 ? half : -half) + half; // Base on ground if target is on ground
            const vz = targetPos.z + (i & 4 ? half : -half);

            const vid = uuidv4();
            vIds.push(vid);
            addNode({
                id: vid,
                type: NodeType.POINT,
                name: `CVertex ${i+1}`,
                dependencies: [targetPointId],
                visible: true,
                position: { x: vx, y: vy, z: vz },
                isConstrained: true // For MVP, tie to center
            });
        }

        // Add Cube Solid Node
        addNode({
            id: uuidv4(),
            type: NodeType.SOLID,
            name: `Cube ${Object.values(nodes).filter(n => n.type === NodeType.SOLID).length + 1}`,
            dependencies: vIds,
            visible: true,
            vertices: vIds.map(id => (nodes[id] as IPointNode)?.position || {x:0, y:0, z:0}), // Initial state, will be updated by DAG
            faces: [
                [0, 1, 3, 2], // Bottom
                [4, 5, 7, 6], // Top
                [0, 1, 5, 4], // Front
                [2, 3, 7, 6], // Back
                [0, 2, 6, 4], // Left
                [1, 3, 7, 5]  // Right
            ]
        });
        setActiveTool(ToolMode.SELECT);
    }
    else if (activeTool === ToolMode.SECTION) {
        if (toolStepData.length < 2) {
            setToolStepData([...toolStepData, targetPointId]);
        } else {
            // We have 3 points to define a plane
            const p1 = toolStepData[0];
            const p2 = toolStepData[1];
            const p3 = targetPointId;

            if (p1 !== p2 && p2 !== p3 && p1 !== p3) {
                const planeId = uuidv4();
                addNode({
                    id: planeId,
                    type: NodeType.PLANE,
                    name: `Plane ${Object.values(nodes).filter(n => n.type === NodeType.PLANE).length + 1}`,
                    dependencies: [p1, p2, p3],
                    visible: true,
                    pointIds: [p1, p2, p3]
                });

                // For MVP, create section for all existing solids
                const solids = Object.values(nodes).filter(n => n.type === NodeType.SOLID);
                solids.forEach(solid => {
                    addNode({
                        id: uuidv4(),
                        type: NodeType.SECTION,
                        name: `Section on ${solid.name}`,
                        dependencies: [planeId, solid.id],
                        visible: true,
                        solidId: solid.id,
                        planeId: planeId,
                        intersectionPoints: [] // Computed by DAG
                    });
                });
            }
            setActiveTool(ToolMode.SELECT);
        }
    }
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
