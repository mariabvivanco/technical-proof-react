import { useState, useOptimistic, useCallback, startTransition } from 'react';
import type { ListItem, UseListManagerReturn } from '../types';
import { INITIAL_ITEMS, createItem } from '../services/itemService';
import useModal from './useModal';
import useSelection from './useSelection';
import useHistory from './useHistory';

const useListManager = (): UseListManagerReturn => {
  const [items, setItems] = useState<ListItem[]>(INITIAL_ITEMS);
  const [addError, setAddError] = useState<string | null>(null);
  const [optimisticItems, addOptimistic] = useOptimistic(
    items,
    (state: ListItem[], item: ListItem) => [...state, item],
  );

  const modal = useModal();
  const { selectedIds, toggle: toggleSelect, clear: clearSelection, remove: removeFromSelection } = useSelection();
  const { save, undo, canUndo } = useHistory(restored => { setItems(restored); clearSelection(); });

  const addItem = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setAddError(null);
    startTransition(() => addOptimistic({ id: crypto.randomUUID(), text: trimmed }));
    save(items);
    try {
      const item = await createItem(trimmed);
      setItems(prev => [...prev, item]);
      modal.close();
    } catch {
      setAddError('Failed to add item. Please try again.');
    }
  }, [items, save, modal.close, addOptimistic]);

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
    addError,
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