import { useState, useCallback } from 'react';
import type { ListItem, UseListManagerReturn } from '../types';

const generateId = () => `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const useListManager = (): UseListManagerReturn => {
  const [items, setItems] = useState<ListItem[]>([
    { id: generateId(), text: 'Item 1' },
    { id: generateId(), text: 'Item 2' },
    { id: generateId(), text: 'Item 3' },
    { id: generateId(), text: 'Item 4' },
  ]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [history, setHistory] = useState<ListItem[][]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const saveToHistory = useCallback((currentItems: ListItem[]) => {
    setHistory((prev) => [...prev, currentItems]);
  }, []);

  const addItem = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      saveToHistory(items);
      setItems((prev) => [...prev, { id: generateId(), text: trimmed }]);
      setIsModalOpen(false);
    },
    [items, saveToHistory]
  );

  const deleteSelected = useCallback(() => {
    if (selectedIds.size === 0) return;

    saveToHistory(items);
    setItems((prev) => prev.filter((item) => !selectedIds.has(item.id)));
    setSelectedIds(new Set());
  }, [items, selectedIds, saveToHistory]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const deleteByDoubleClick = useCallback(
    (id: string) => {
      saveToHistory(items);
      setItems((prev) => prev.filter((item) => item.id !== id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
    [items, saveToHistory]
  );

  const undo = useCallback(() => {
    if (history.length === 0) return;

    setHistory((prev) => {
      const newHistory = [...prev];
      const previousItems = newHistory.pop()!;
      setItems(previousItems);
      setSelectedIds(new Set());
      return newHistory;
    });
  }, [history]);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return {
    items,
    selectedIds,
    history,
    isModalOpen,
    addItem,
    deleteSelected,
    toggleSelect,
    deleteByDoubleClick,
    undo,
    openModal,
    closeModal,
  };
};

export default useListManager;
