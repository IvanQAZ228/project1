import { useToolStore } from '../../store/useToolStore';
import { ToolMode } from '../../types/store.types';
import { MousePointer2, Dot, Minus, Box, Pyramid, Scissors, PenTool } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const tools = [
  { mode: ToolMode.SELECT, icon: MousePointer2, label: 'Выбор' },
  { mode: ToolMode.POINT, icon: Dot, label: 'Точка' },
  { mode: ToolMode.LINE, icon: Minus, label: 'Линия' },
  { mode: ToolMode.CUBE, icon: Box, label: 'Куб (клик - центр)' },
  { mode: ToolMode.PYRAMID, icon: Pyramid, label: 'Пирамида' },
  { mode: ToolMode.SECTION, icon: Scissors, label: 'Сечение (по 3 точкам)' },
  { mode: ToolMode.SKETCH, icon: PenTool, label: 'Эскиз' },
];

export const Toolbar = () => {
  const activeTool = useToolStore(state => state.activeTool);
  const setActiveTool = useToolStore(state => state.setActiveTool);

  const toolStepData = useToolStore(state => state.toolStepData);

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 hidden md:flex">
      <div className="flex gap-2 p-2 bg-white rounded-lg shadow-lg border border-slate-200">
        {tools.map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => setActiveTool(mode)}
          className={cn(
            "p-2 rounded-md flex items-center justify-center transition-colors",
            activeTool === mode
              ? "bg-blue-100 text-blue-600"
              : "text-slate-600 hover:bg-slate-100"
          )}
          title={label}
        >
          <Icon className="w-5 h-5" />
        </button>
        ))}
      </div>
      {toolStepData.length > 0 && (
         <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded shadow text-sm">
            Шагов выбрано: {toolStepData.length}
         </div>
      )}
    </div>
  );
};