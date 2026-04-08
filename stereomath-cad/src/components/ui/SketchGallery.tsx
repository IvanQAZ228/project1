import { useSketchMode } from '../../hooks/useSketchMode';

export const SketchGallery = () => {
  // In a real implementation this would pull from the store of all created sketches.
  const isSketchMode = useSketchMode(state => state.isSketchMode);

  return (
    <div className="w-64 bg-white rounded-lg shadow-lg border border-slate-200">
      <div className="p-3 border-b border-slate-100 font-semibold text-slate-700">Эскизы (Sketches)</div>
      <div className="p-2 flex flex-col gap-2">
         {/* Placeholder for Thumbnails */}
         <div className="text-xs text-slate-500 italic p-2">
            Галерея эскизов. Создайте эскиз на грани фигуры, чтобы он появился здесь.
         </div>
      </div>
    </div>
  );
};