import { useState } from 'react';

interface DragItem {
  id: string;
  type: string;
}

export function useDragAndDrop<T extends DragItem>() {
  const [draggedItem, setDraggedItem] = useState<T | null>(null);

  function handleDragStart(item: T) {
    setDraggedItem(item);
  }

  function handleDragEnd() {
    setDraggedItem(null);
  }

  return {
    draggedItem,
    handleDragStart,
    handleDragEnd,
  };
}