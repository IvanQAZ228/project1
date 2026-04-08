import { useSketchMode } from '../../hooks/useSketchMode';

export const SketchOverlay = () => {
  const { isSketchMode, exitSketchMode } = useSketchMode();

  if (!isSketchMode) return null;

  return (
    <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center bg-black/10">
        <div className="absolute top-4 right-4 pointer-events-auto">
            <button
                onClick={exitSketchMode}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow-lg"
            >
                Завершить эскиз
            </button>
        </div>

        {/* Here we would put a flat 2D canvas context or an overlay that maps mouse coordinates
            to the 2D local basis, then adds to DAGraph upon click.
            For MVP, we just render the framing. */}
        <div className="pointer-events-auto w-[80%] h-[80%] border-4 border-blue-500 bg-white/30 backdrop-blur-sm flex items-center justify-center">
            <span className="text-blue-800 font-bold">2D Режим черчения на грани</span>
            {/* Grid2D and DraftTools would go here */}
        </div>
    </div>
  );
};
