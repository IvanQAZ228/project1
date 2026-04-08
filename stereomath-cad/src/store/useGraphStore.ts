import { create } from 'zustand';
import { GraphState, ToolMode, ToolState, UIState } from '../types/store.types';
import { DAGraph } from '../core/engine/DAGraph';
import { AnyNode } from '../types/graph.types';
import { v4 as uuidv4 } from 'uuid';

const daGraph = new DAGraph();

// Try load from localstorage
const loadInitialState = (): Record<string, AnyNode> => {
  try {
    const saved = localStorage.getItem('stereomath_graph');
    if (saved) {
      const parsed = JSON.parse(saved);
      daGraph.load(parsed);
      return daGraph.toStateNodes();
    }
  } catch (e) {
    console.error("Failed to load graph", e);
  }
  return {};
};

const saveToLocalStorage = (nodes: Record<string, AnyNode>) => {
  localStorage.setItem('stereomath_graph', JSON.stringify(nodes));
};

export const useGraphStore = create<GraphState>((set, get) => {
  // Initialize DAGraph with initial state
  const initialNodes = loadInitialState();

  return {
    nodes: initialNodes,
    selectedNodeIds: [],

    addNode: (node: AnyNode) => {
      // Create new id if not provided (should be provided, but safe fallback)
      if (!node.id) node.id = uuidv4();
      daGraph.addNode(node);
      const newNodes = daGraph.toStateNodes();
      saveToLocalStorage(newNodes);
      set({ nodes: newNodes });
    },

    removeNode: (id: string) => {
      daGraph.removeNode(id);
      const newNodes = daGraph.toStateNodes();
      saveToLocalStorage(newNodes);
      set((state) => ({
        nodes: newNodes,
        selectedNodeIds: state.selectedNodeIds.filter(selectedId => selectedId !== id)
      }));
    },

    updateNode: (id: string, data: Partial<AnyNode>) => {
      daGraph.updateNode(id, data);
      const newNodes = daGraph.toStateNodes();
      saveToLocalStorage(newNodes);
      set({ nodes: newNodes });
    },

    selectNode: (id: string, multi: boolean = false) => {
      set((state) => {
        if (multi) {
          if (state.selectedNodeIds.includes(id)) {
            return { selectedNodeIds: state.selectedNodeIds.filter(sid => sid !== id) };
          }
          return { selectedNodeIds: [...state.selectedNodeIds, id] };
        }
        return { selectedNodeIds: [id] };
      });
    },

    clearSelection: () => set({ selectedNodeIds: [] }),

    clearGraph: () => {
      daGraph.load({});
      saveToLocalStorage({});
      set({ nodes: {}, selectedNodeIds: [] });
    }
  };
});
