export const DraftTools = () => {
  return (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-white shadow-lg p-2 rounded flex flex-col gap-2 pointer-events-auto">
      <button className="p-2 hover:bg-gray-100 rounded" title="Точка">
        •
      </button>
      <button className="p-2 hover:bg-gray-100 rounded" title="Линия">
        /
      </button>
    </div>
  );
};
