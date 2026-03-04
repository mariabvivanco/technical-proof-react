import { useState, useCallback, useRef } from 'react';
import type { ListItem } from '../types';

const useHistory = (onRestore: (items: ListItem[]) => void) => {
  const [stack, setStack] = useState<ListItem[][]>([]);
  const restoreRef = useRef(onRestore);
  restoreRef.current = onRestore; 

  const save = useCallback((items: ListItem[]) => {
    setStack(prev => [...prev, items]);
  }, []);

  const undo = useCallback(() => {
    setStack(prev => {
      if (!prev.length) return prev;
      const next = [...prev];
      restoreRef.current(next.pop()!);
      return next;
    });
  }, []); 

  return { save, undo, canUndo: stack.length > 0 };
};

export default useHistory;
