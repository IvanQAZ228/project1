import { useGraphStore } from '../../store/useGraphStore';
import { IPointNode, ILineNode, NodeType } from '../../types/graph.types';
import * as THREE from 'three';
import { useUIStore } from '../../store/useUIStore';
import { RenderMode } from '../../types/store.types';

export const PropertiesPanel = () => {
  const selectedNodeIds = useGraphStore(state => state.selectedNodeIds);
  const nodes = useGraphStore(state => state.nodes);
  const renderMode = useUIStore(state => state.renderMode);
  const setRenderMode = useUIStore(state => state.setRenderMode);

  if (selectedNodeIds.length !== 1) return null;

  const node = nodes[selectedNodeIds[0]];

  if (!node) return null;

  let length = 0;
  if (node.type === NodeType.LINE) {
      const p1 = nodes[(node as ILineNode).startPointId] as IPointNode;
      const p2 = nodes[(node as ILineNode).endPointId] as IPointNode;
      if (p1 && p2) {
          const v1 = new THREE.Vector3(p1.position.x, p1.position.y, p1.position.z);
          const v2 = new THREE.Vector3(p2.position.x, p2.position.y, p2.position.z);
          length = v1.distanceTo(v2);
      }
  }

  let area = 0;
  if (node.type === NodeType.SECTION) {
      const points = (node as any).intersectionPoints;
      if (points && points.length > 2) {
          // Calculate area of 3D polygon using Newell's method or simple triangulation (since convex)
          const centroid = new THREE.Vector3();
          const vecs = points.map((p: any) => new THREE.Vector3(p.x, p.y, p.z));
          for (const v of vecs) centroid.add(v);
          centroid.divideScalar(vecs.length);

          for (let i = 0; i < vecs.length; i++) {
              const v1 = vecs[i];
              const v2 = vecs[(i + 1) % vecs.length];
              const triArea = new THREE.Vector3().crossVectors(
                  new THREE.Vector3().subVectors(v1, centroid),
                  new THREE.Vector3().subVectors(v2, centroid)
              ).length() / 2;
              area += triArea;
          }
      }
  }

  return (
    <div className="absolute top-20 right-4 w-64 bg-white rounded-lg shadow-lg border border-slate-200 z-10 hidden md:block">
      <div className="p-3 border-b border-slate-100 font-semibold text-slate-700">Свойства</div>
      <div className="p-3 text-sm text-slate-600 flex flex-col gap-2">
        <div><strong>Имя:</strong> {node.name}</div>
        <div><strong>Тип:</strong> {node.type}</div>

        {node.type === NodeType.POINT && (
          <div className="flex flex-col gap-1 mt-2">
            <div className="font-medium text-slate-700">Координаты:</div>
            <div className="font-mono bg-slate-50 p-2 rounded">
              X: {(node as IPointNode).position.x.toFixed(2)}<br/>
              Y: {(node as IPointNode).position.y.toFixed(2)}<br/>
              Z: {(node as IPointNode).position.z.toFixed(2)}
            </div>
          </div>
        )}

        {node.type === NodeType.LINE && (
          <div className="flex flex-col gap-1 mt-2">
            <div className="font-medium text-slate-700">Длина:</div>
            <div className="font-mono bg-slate-50 p-2 rounded">
              {length.toFixed(2)} ед.
            </div>
          </div>
        )}

        {node.type === NodeType.SECTION && (
          <div className="flex flex-col gap-1 mt-2">
            <div className="font-medium text-slate-700">Площадь сечения:</div>
            <div className="font-mono bg-slate-50 p-2 rounded">
              {area.toFixed(2)} кв. ед.
            </div>
          </div>
        )}

        {(node.type === NodeType.SOLID || node.type === NodeType.SECTION) && (
            <div className="flex flex-col gap-1 mt-2">
                <div className="font-medium text-slate-700">Рендер:</div>
                <select
                    className="p-1 border rounded"
                    value={renderMode}
                    onChange={(e) => setRenderMode(e.target.value as RenderMode)}
                >
                    <option value={RenderMode.SOLID}>Solid</option>
                    <option value={RenderMode.WIREFRAME}>Wireframe</option>
                    <option value={RenderMode.TRANSPARENT}>Transparent</option>
                </select>
            </div>
        )}
      </div>
    </div>
  );
};