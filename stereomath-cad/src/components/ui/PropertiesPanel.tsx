import { useGraphStore } from '../../store/useGraphStore';
import { IPointNode, ILineNode, IPlaneNode, NodeType } from '../../types/graph.types';
import * as THREE from 'three';
import { useUIStore } from '../../store/useUIStore';
import { RenderMode } from '../../types/store.types';
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

export const PropertiesPanel = () => {
  const selectedNodeIds = useGraphStore(state => state.selectedNodeIds);
  const nodes = useGraphStore(state => state.nodes);

  if (selectedNodeIds.length !== 1) return null;

  const node = nodes[selectedNodeIds[0]];
  const updateNode = useGraphStore(state => state.updateNode);
  const removeNode = useGraphStore(state => state.removeNode);
  const renderMode = useUIStore(state => state.renderMode);
  const setRenderMode = useUIStore(state => state.setRenderMode);

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

  const handleCoordChange = (axis: 'x' | 'y' | 'z', value: string) => {
    if (node.type !== NodeType.POINT) return;
    const num = parseFloat(value);
    if (!isNaN(num)) {
        updateNode(node.id, {
            position: { ...((node as IPointNode).position), [axis]: num }
        });
    }
  };

  return (
    <div className="absolute top-20 right-4 w-64 bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-slate-200 z-10 hidden md:block">
      <div className="p-3 border-b border-slate-100 font-semibold text-slate-700">Свойства</div>
      <div className="p-3 text-sm text-slate-600 flex flex-col gap-2">
        <div><strong>Имя:</strong> {node.name}</div>
        <div><strong>Тип:</strong> {node.type}</div>

        {node.dependencies.length > 0 && (
            <div className="text-xs text-slate-500 bg-slate-100 p-1 rounded">
                Зависит от: {node.dependencies.map(id => nodes[id]?.name).filter(Boolean).join(', ')}
            </div>
        )}

        {node.type === NodeType.POINT && (
          <div className="flex flex-col gap-1 mt-2">
            <div className="font-medium text-slate-700">Координаты:</div>
            <div className="flex items-center gap-2">
               <span>X:</span>
               <input type="number" step="0.1" value={(node as IPointNode).position.x} onChange={(e) => handleCoordChange('x', e.target.value)} className="border rounded w-full p-1" />
            </div>
            <div className="flex items-center gap-2">
               <span>Y:</span>
               <input type="number" step="0.1" value={(node as IPointNode).position.y} onChange={(e) => handleCoordChange('y', e.target.value)} className="border rounded w-full p-1" />
            </div>
            <div className="flex items-center gap-2">
               <span>Z:</span>
               <input type="number" step="0.1" value={(node as IPointNode).position.z} onChange={(e) => handleCoordChange('z', e.target.value)} className="border rounded w-full p-1" />
            </div>
          </div>
        )}

        {node.type === NodeType.LINE && (
          <div className="flex flex-col gap-1 mt-2">
            <div className="font-medium text-slate-700">Длина:</div>
            <div className="bg-slate-50 p-2 rounded">
              <InlineMath math={`L = ${length.toFixed(2)} \\text{ ед.}`} />
            </div>
          </div>
        )}

        {node.type === NodeType.PLANE && (node as IPlaneNode).equation && (
            <div className="flex flex-col gap-1 mt-2">
                <div className="font-medium text-slate-700">Уравнение плоскости:</div>
                <div className="bg-slate-50 p-2 rounded overflow-x-auto">
                    {(() => {
                        const eq = (node as IPlaneNode).equation!;
                        return <BlockMath math={`${eq.a.toFixed(2)}x + ${eq.b.toFixed(2)}y + ${eq.c.toFixed(2)}z + ${eq.d.toFixed(2)} = 0`} />;
                    })()}
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

        <div className="mt-4 pt-4 border-t border-slate-100">
            <button
                onClick={() => removeNode(node.id)}
                className="w-full py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded border border-red-200 transition-colors font-medium text-sm"
            >
                Удалить объект
            </button>
            {node.type !== NodeType.POINT && (
               <div className="text-[10px] text-red-400 mt-1 text-center leading-tight">
                   Внимание: зависимые объекты также будут удалены.
               </div>
            )}
        </div>

      </div>
    </div>
  );
};