import { Grid } from '@react-three/drei';

export const Grid3D = () => {
  return (
    <Grid
      infiniteGrid
      fadeDistance={50}
      sectionColor="#cccccc"
      cellColor="#eeeeee"
      position={[0, -0.01, 0]} // slightly offset to prevent z-fighting with zero-plane geometry
    />
  );
};
