import { useState, useOptimistic, useCallback, startTransition } from 'react';
import type { ListItem } from '../types';
import { createItem } from '../services/itemService';
import useModal from './useModal';
import useSelection from './useSelection';
import useHistory from './useHistory';

const INITIAL_ITEMS: ListItem[] = [
  { id: crypto.randomUUID(), text: 'Item 1' },
  { id: crypto.randomUUID(), text: 'Item 2' },
  { id: crypto.randomUUID(), text: 'Item 3' },
  { id: crypto.randomUUID(), text: 'Item 4' },
];

const useListManager = () => {
  const [items, setItems] = useState<ListItem[]>(INITIAL_ITEMS);
  const [optimisticItems, addOptimistic] = useOptimistic(
    items,
    (state: ListItem[], item: ListItem) => [...state, item],
  );

  const modal = useModal();
  const { selectedIds, toggle: toggleSelect, clear: clearSelection, remove: removeFromSelection } = useSelection();
  const { save, undo, canUndo } = useHistory(restored => {
    setItems(restored);
    clearSelection();
  });

  const addItem = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    startTransition(() => addOptimistic({ id: crypto.randomUUID(), text: trimmed }));
    save(items);
    const item = await createItem(trimmed);
    setItems(prev => [...prev, item]);
    modal.close();
  };

  const deleteSelected = useCallback(() => {
    if (!selectedIds.size) return;
    save(items);
    setItems(prev => prev.filter(({ id }) => !selectedIds.has(id)));
    clearSelection();
  }, [items, selectedIds, save, clearSelection]);

  const deleteByDoubleClick = useCallback((id: string) => {
    save(items);
    setItems(prev => prev.filter(item => item.id !== id));
    removeFromSelection(id);
  }, [items, save, removeFromSelection]);

  return {
    items: optimisticItems,
    selectedIds,
    canUndo,
    isModalOpen: modal.isOpen,
    addItem,
    deleteSelected,
    toggleSelect,
    deleteByDoubleClick,
    undo,
    openModal: modal.open,
    closeModal: modal.close,
  };
};

export default useListManager;