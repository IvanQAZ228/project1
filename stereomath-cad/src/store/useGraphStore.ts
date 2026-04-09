import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GraphState, ToolMode, ToolState, UIState } from '../types/store.types';
import { DAGraph } from '../core/engine/DAGraph';
import { AnyNode } from '../types/graph.types';
import { v4 as uuidv4 } from 'uuid';

const daGraph = new DAGraph();

export const useGraphStore = create<GraphState>()(
  persist(
    (set, get) => ({
      nodes: {},
      selectedNodeIds: [],

      addNode: (node: AnyNode) => {
        if (!node.id) node.id = uuidv4();
        daGraph.addNode(node);
        set({ nodes: daGraph.toStateNodes() });
      },

      removeNode: (id: string) => {
        daGraph.removeNode(id);
        set((state) => ({
          nodes: daGraph.toStateNodes(),
          selectedNodeIds: state.selectedNodeIds.filter(selectedId => selectedId !== id)
        }));
      },

      updateNode: (id: string, data: Partial<AnyNode>) => {
        daGraph.updateNode(id, data);
        set({ nodes: daGraph.toStateNodes() });
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
        set({ nodes: {}, selectedNodeIds: [] });
      }
    }),
    {
      name: 'stereomath_graph',
      onRehydrateStorage: () => (state) => {
        if (state && state.nodes) {
          daGraph.load(state.nodes);
        }
      }
    }
  )
);
