export const Grid2D = () => {
  return (
    <div
      className="absolute inset-0 z-[-1]"
      style={{
        backgroundImage: 'linear-gradient(to right, #ccc 1px, transparent 1px), linear-gradient(to bottom, #ccc 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}
    />
  );
};
