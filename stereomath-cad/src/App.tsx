import { Scene3D } from './components/canvas3d/Scene3D';
import { Layout } from './components/ui/Layout';
import { useShortcuts } from './hooks/useShortcuts';
import { SketchOverlay } from './components/canvas2d/SketchOverlay';

function App() {
  useShortcuts();

  return (
    <Layout>
      <Scene3D />
      <SketchOverlay />
    </Layout>
  );
}

export default App;