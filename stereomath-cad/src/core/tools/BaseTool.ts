import { ToolMode } from '../../types/store.types';
import { useGraphStore } from '../../store/useGraphStore';
import { useToolStore } from '../../store/useToolStore';
import { useUIStore } from '../../store/useUIStore';
import * as THREE from 'three';

export abstract class BaseTool {
  abstract mode: ToolMode;
  abstract label: string;
  abstract icon: any;
  category: string = 'Other';

  // Called when canvas is clicked while this tool is active
  abstract onClick(
    targetPos: THREE.Vector3 | null,
    targetPointId: string | undefined,
    context: {
        nodes: any;
        addNode: any;
        toolStepData: any[];
        setToolStepData: any;
        setActiveTool: any;
    }
  ): void;
}
