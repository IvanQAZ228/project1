import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../store/useUIStore';
import { useToolStore } from '../../store/useToolStore';
import { ToolMode } from '../../types/store.types';
import { cn } from './Toolbar';
import { ChevronUp, Eye, Edit2 } from 'lucide-react';

const tools = [
    { mode: ToolMode.SELECT, label: 'Выбор' },
    { mode: ToolMode.POINT, label: 'Точка' },
    { mode: ToolMode.LINE, label: 'Линия' },
    { mode: ToolMode.CUBE, label: 'Куб' },
    { mode: ToolMode.SECTION, label: 'Сечение' },
];

export const MobileSheet = () => {
  const { isMobileSheetOpen, setMobileSheetOpen, isDrawMode, setDrawMode } = useUIStore();
  const activeTool = useToolStore(state => state.activeTool);
  const setActiveTool = useToolStore(state => state.setActiveTool);

  return (
    <div className="md:hidden">
      {/* Toggle View/Draw Mode Button */}
      <div className="absolute bottom-6 right-6 z-20">
        <button
          onClick={() => setDrawMode(!isDrawMode)}
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-colors text-white",
            isDrawMode ? "bg-blue-600" : "bg-slate-800"
          )}
        >
          {isDrawMode ? <Edit2 /> : <Eye />}
        </button>
      </div>

      <AnimatePresence>
        {isDrawMode && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: isMobileSheetOpen ? 0 : "calc(100% - 40px)" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-10 flex flex-col"
          >
            <div
              className="h-10 flex items-center justify-center cursor-pointer"
              onClick={() => setMobileSheetOpen(!isMobileSheetOpen)}
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>

            <div className="p-4 pt-0 grid grid-cols-4 gap-4 pb-8">
              {tools.map(({ mode, label }) => (
                <button
                  key={mode}
                  onClick={() => setActiveTool(mode)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-colors",
                    activeTool === mode ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <div className="text-xs font-medium">{label}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};