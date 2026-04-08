import { useEffect } from 'react';
import { useGraphStore } from '../store/useGraphStore';

export const useShortcuts = () => {
  const selectedNodeIds = useGraphStore((state) => state.selectedNodeIds);
  const removeNode = useGraphStore((state) => state.removeNode);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        selectedNodeIds.forEach(id => removeNode(id));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeIds, removeNode]);
};
