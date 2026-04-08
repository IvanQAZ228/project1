import { useGraphStore } from '../../store/useGraphStore';
import { NodeType } from '../../types/graph.types';
import { cn } from './Toolbar';

export const ObjectTree = () => {
  const nodes = useGraphStore(state => state.nodes);
  const selectedNodeIds = useGraphStore(state => state.selectedNodeIds);
  const selectNode = useGraphStore(state => state.selectNode);

  const getTypeColor = (type: NodeType) => {
    switch(type) {
      case NodeType.POINT: return 'text-red-500';
      case NodeType.LINE: return 'text-blue-500';
      case NodeType.SOLID: return 'text-green-500';
      case NodeType.SECTION: return 'text-orange-500';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="absolute top-20 left-4 w-64 max-h-[calc(100vh-6rem)] overflow-y-auto bg-white rounded-lg shadow-lg border border-slate-200 z-10 hidden md:block">
      <div className="p-3 border-b border-slate-100 font-semibold text-slate-700">Дерево объектов</div>
      <div className="p-2 flex flex-col gap-1">
        {Object.values(nodes).map(node => (
          <div
            key={node.id}
            onClick={(e) => selectNode(node.id, e.shiftKey)}
            className={cn(
              "px-2 py-1 rounded text-sm cursor-pointer flex justify-between items-center transition-colors",
              selectedNodeIds.includes(node.id) ? "bg-blue-50 text-blue-700 font-medium" : "hover:bg-slate-50 text-slate-600"
            )}
          >
            <span className="truncate">{node.name}</span>
            <span className={cn("text-xs font-mono", getTypeColor(node.type))}>{node.type[0]}</span>
          </div>
        ))}
        {Object.keys(nodes).length === 0 && (
          <div className="text-sm text-slate-400 p-2 text-center">Сцена пуста</div>
        )}
      </div>
    </div>
  );
};