import { useThree, useFrame } from '@react-three/fiber';
import { useGraphStore } from '../store/useGraphStore';
import { useToolStore } from '../store/useToolStore';
import { ToolMode } from '../types/store.types';
import { NodeType, IPointNode, AnyNode } from '../types/graph.types';
import { useState, useCallback, useRef } from 'react';
import * as THREE from 'three';

export const useDragPoint = (meshRef: React.RefObject<THREE.Mesh | null>) => {
  const { raycaster, camera, pointer } = useThree();
  const nodes = useGraphStore(state => state.nodes);
  const updateNode = useGraphStore(state => state.updateNode);
  const activeTool = useToolStore(state => state.activeTool);

  const [draggedPointId, setDraggedPointId] = useState<string | null>(null);
  const [dragPlane, setDragPlane] = useState<THREE.Plane | null>(null);
  const localPos = useRef<THREE.Vector3 | null>(null);

  const onPointerDown = useCallback((e: any, id: string) => {
    if (activeTool !== ToolMode.SELECT) return;
    e.stopPropagation();

    const node = nodes[id] as IPointNode;
    if (node.isConstrained) return; // Cannot drag constrained points freely for now

    setDraggedPointId(id);

    // Create a plane passing through the point, facing the camera for moving parallel to screen
    const p = new THREE.Vector3(node.position.x, node.position.y, node.position.z);
    const normal = camera.getWorldDirection(new THREE.Vector3()).negate();
    const plane = new THREE.Plane().setFromNormalAndCoplanarPoint(normal, p);
    setDragPlane(plane);
  }, [activeTool, nodes, camera]);

  const onPointerUp = useCallback(() => {
    if (draggedPointId && localPos.current) {
      updateNode(draggedPointId, { position: { x: localPos.current.x, y: localPos.current.y, z: localPos.current.z } });
    }
    setDraggedPointId(null);
    setDragPlane(null);
    localPos.current = null;
  }, [draggedPointId, updateNode]);

  useFrame(() => {
    if (draggedPointId && dragPlane) {
      raycaster.setFromCamera(pointer, camera);
      const target = new THREE.Vector3();
      raycaster.ray.intersectPlane(dragPlane, target);

      if (target) {
        if (meshRef?.current) {
          meshRef.current.position.set(target.x, target.y, target.z);
        }
        localPos.current = target;
      }
    }
  });

  return { onPointerDown, onPointerUp, isDragging: !!draggedPointId };
};
