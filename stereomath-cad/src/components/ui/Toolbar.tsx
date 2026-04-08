import { useToolStore } from '../../store/useToolStore';
import { useUIStore } from '../../store/useUIStore';
import { ToolMode, AppMode } from '../../types/store.types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getToolsByCategory } from '../../core/tools/ToolRegistry';
import { MousePointer2 } from 'lucide-react';
import { useState } from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Toolbar = () => {
  const activeTool = useToolStore(state => state.activeTool);
  const setActiveTool = useToolStore(state => state.setActiveTool);
  const toolStepData = useToolStore(state => state.toolStepData);

  const appMode = useUIStore(state => state.appMode);
  const setAppMode = useUIStore(state => state.setAppMode);

  const toolsByCategory = getToolsByCategory();
  const [activeCategory, setActiveCategory] = useState<string | null>(Object.keys(toolsByCategory)[0]);

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 hidden md:flex">
      <div className="flex gap-2 p-2 bg-white rounded-lg shadow-lg border border-slate-200 mb-2">
        <button onClick={() => setAppMode(AppMode.VIEW)} className={cn("px-4 py-1 rounded", appMode === AppMode.VIEW ? "bg-slate-800 text-white" : "bg-slate-100")}>View</button>
        <button onClick={() => setAppMode(AppMode.CONSTRUCT)} className={cn("px-4 py-1 rounded", appMode === AppMode.CONSTRUCT ? "bg-slate-800 text-white" : "bg-slate-100")}>Construct</button>
        <button onClick={() => setAppMode(AppMode.SKETCH)} className={cn("px-4 py-1 rounded", appMode === AppMode.SKETCH ? "bg-slate-800 text-white" : "bg-slate-100")}>Sketch</button>
      </div>

      {appMode !== AppMode.VIEW && (
        <div className="flex flex-col gap-2 bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-slate-200 p-2">

            <div className="flex gap-2 border-b pb-2">
                <button
                    onClick={() => setActiveTool(ToolMode.SELECT)}
                    className={cn(
                        "p-2 rounded-md flex items-center justify-center transition-colors",
                        activeTool === ToolMode.SELECT ? "bg-blue-100 text-blue-600" : "text-slate-600 hover:bg-slate-100"
                    )}
                    title="Выбор"
                >
                    <MousePointer2 className="w-5 h-5" />
                </button>
                <div className="w-px bg-slate-200 mx-1"></div>
                {Object.keys(toolsByCategory).map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={cn("px-3 py-1 rounded text-sm font-medium transition-colors", activeCategory === cat ? "bg-slate-200 text-slate-800" : "text-slate-500 hover:bg-slate-100")}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {activeCategory && (
                <div className="flex gap-2">
                {toolsByCategory[activeCategory].map(tool => {
                    const Icon = tool.icon;
                    return (
                        <button
                            key={tool.mode}
                            onClick={() => setActiveTool(tool.mode)}
                            className={cn(
                            "p-2 rounded-md flex items-center justify-center transition-colors",
                            activeTool === tool.mode ? "bg-blue-100 text-blue-600" : "text-slate-600 hover:bg-slate-100"
                            )}
                            title={tool.label}
                        >
                            <Icon className="w-5 h-5" />
                        </button>
                    )
                })}
                </div>
            )}
        </div>
      )}

      {toolStepData.length > 0 && (
         <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded shadow text-sm">
            Шагов выбрано: {toolStepData.length}
         </div>
      )}
    </div>
  );
};