import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import useListManager from '../useListManager';

describe('useListManager', () => {
  describe('initial state', () => {
    it('starts with 4 default items', () => {
      const { result } = renderHook(() => useListManager());
      expect(result.current.items).toHaveLength(4);
    });

    it('starts with no selections', () => {
      const { result } = renderHook(() => useListManager());
      expect(result.current.selectedIds.size).toBe(0);
    });

    it('starts with empty history', () => {
      const { result } = renderHook(() => useListManager());
      expect(result.current.history).toHaveLength(0);
    });

    it('starts with modal closed', () => {
      const { result } = renderHook(() => useListManager());
      expect(result.current.isModalOpen).toBe(false);
    });
  });

  describe('addItem', () => {
    it('adds a new item to the list', () => {
      const { result } = renderHook(() => useListManager());
      act(() => result.current.addItem('New Item'));
      expect(result.current.items).toHaveLength(5);
      expect(result.current.items[4].text).toBe('New Item');
    });

    it('does not add empty string items', () => {
      const { result } = renderHook(() => useListManager());
      act(() => result.current.addItem(''));
      expect(result.current.items).toHaveLength(4);
    });

    it('does not add whitespace-only items', () => {
      const { result } = renderHook(() => useListManager());
      act(() => result.current.addItem('   '));
      expect(result.current.items).toHaveLength(4);
    });

    it('trims whitespace from added items', () => {
      const { result } = renderHook(() => useListManager());
      act(() => result.current.addItem('  New Item  '));
      expect(result.current.items[4].text).toBe('New Item');
    });

    it('saves current state to history before adding', () => {
      const { result } = renderHook(() => useListManager());
      act(() => result.current.addItem('New Item'));
      expect(result.current.history).toHaveLength(1);
    });

    it('closes the modal after adding an item', () => {
      const { result } = renderHook(() => useListManager());
      act(() => result.current.openModal());
      act(() => result.current.addItem('New Item'));
      expect(result.current.isModalOpen).toBe(false);
    });

    it('assigns a unique id to each added item', () => {
      const { result } = renderHook(() => useListManager());
      act(() => result.current.addItem('A'));
      act(() => result.current.addItem('B'));
      const ids = result.current.items.map((i) => i.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('deleteSelected', () => {
    it('deletes a single selected item', () => {
      const { result } = renderHook(() => useListManager());
      const itemId = result.current.items[0].id;
      act(() => result.current.toggleSelect(itemId));
      act(() => result.current.deleteSelected());
      expect(result.current.items).toHaveLength(3);
      expect(result.current.items.find((i) => i.id === itemId)).toBeUndefined();
    });

    it('deletes multiple selected items', () => {
      const { result } = renderHook(() => useListManager());
      const id1 = result.current.items[0].id;
      const id2 = result.current.items[2].id;
      act(() => result.current.toggleSelect(id1));
      act(() => result.current.toggleSelect(id2));
      act(() => result.current.deleteSelected());
      expect(result.current.items).toHaveLength(2);
      expect(result.current.items.find((i) => i.id === id1)).toBeUndefined();
      expect(result.current.items.find((i) => i.id === id2)).toBeUndefined();
    });

    it('does nothing when no items are selected', () => {
      const { result } = renderHook(() => useListManager());
      act(() => result.current.deleteSelected());
      expect(result.current.items).toHaveLength(4);
    });

    it('clears selection after delete', () => {
      const { result } = renderHook(() => useListManager());
      const itemId = result.current.items[0].id;
      act(() => result.current.toggleSelect(itemId));
      act(() => result.current.deleteSelected());
      expect(result.current.selectedIds.size).toBe(0);
    });

    it('saves state to history before deleting', () => {
      const { result } = renderHook(() => useListManager());
      const itemId = result.current.items[0].id;
      act(() => result.current.toggleSelect(itemId));
      act(() => result.current.deleteSelected());
      expect(result.current.history).toHaveLength(1);
    });

    it('does not save to history when nothing is selected', () => {
      const { result } = renderHook(() => useListManager());
      act(() => result.current.deleteSelected());
      expect(result.current.history).toHaveLength(0);
    });
  });

  describe('toggleSelect', () => {
    it('selects an unselected item', () => {
      const { result } = renderHook(() => useListManager());
      const itemId = result.current.items[0].id;
      act(() => result.current.toggleSelect(itemId));
      expect(result.current.selectedIds.has(itemId)).toBe(true);
    });

    it('deselects an already selected item', () => {
      const { result } = renderHook(() => useListManager());
      const itemId = result.current.items[0].id;
      act(() => result.current.toggleSelect(itemId));
      act(() => result.current.toggleSelect(itemId));
      expect(result.current.selectedIds.has(itemId)).toBe(false);
    });

    it('supports selecting multiple items independently', () => {
      const { result } = renderHook(() => useListManager());
      const id1 = result.current.items[0].id;
      const id2 = result.current.items[1].id;
      act(() => result.current.toggleSelect(id1));
      act(() => result.current.toggleSelect(id2));
      expect(result.current.selectedIds.size).toBe(2);
      expect(result.current.selectedIds.has(id1)).toBe(true);
      expect(result.current.selectedIds.has(id2)).toBe(true);
    });

    it('deselecting one item does not affect others', () => {
      const { result } = renderHook(() => useListManager());
      const id1 = result.current.items[0].id;
      const id2 = result.current.items[1].id;
      act(() => result.current.toggleSelect(id1));
      act(() => result.current.toggleSelect(id2));
      act(() => result.current.toggleSelect(id1));
      expect(result.current.selectedIds.has(id1)).toBe(false);
      expect(result.current.selectedIds.has(id2)).toBe(true);
    });
  });

  describe('deleteByDoubleClick', () => {
    it('removes the item with the given id', () => {
      const { result } = renderHook(() => useListManager());
      const itemId = result.current.items[0].id;
      act(() => result.current.deleteByDoubleClick(itemId));
      expect(result.current.items).toHaveLength(3);
      expect(result.current.items.find((i) => i.id === itemId)).toBeUndefined();
    });

    it('saves state to history', () => {
      const { result } = renderHook(() => useListManager());
      act(() => result.current.deleteByDoubleClick(result.current.items[0].id));
      expect(result.current.history).toHaveLength(1);
    });

    it('removes the item from selection if it was selected', () => {
      const { result } = renderHook(() => useListManager());
      const itemId = result.current.items[0].id;
      act(() => result.current.toggleSelect(itemId));
      act(() => result.current.deleteByDoubleClick(itemId));
      expect(result.current.selectedIds.has(itemId)).toBe(false);
    });
  });

  describe('undo', () => {
    it('restores the list to its previous state', () => {
      const { result } = renderHook(() => useListManager());
      act(() => result.current.addItem('New Item'));
      expect(result.current.items).toHaveLength(5);
      act(() => result.current.undo());
      expect(result.current.items).toHaveLength(4);
    });

    it('does nothing when history is empty', () => {
      const { result } = renderHook(() => useListManager());
      act(() => result.current.undo());
      expect(result.current.items).toHaveLength(4);
    });

    it('clears selection after undo', () => {
      const { result } = renderHook(() => useListManager());
      act(() => result.current.addItem('New Item'));
      act(() => result.current.toggleSelect(result.current.items[0].id));
      act(() => result.current.undo());
      expect(result.current.selectedIds.size).toBe(0);
    });

    it('removes the used entry from history', () => {
      const { result } = renderHook(() => useListManager());
      act(() => result.current.addItem('Item A'));
      act(() => result.current.addItem('Item B'));
      expect(result.current.history).toHaveLength(2);
      act(() => result.current.undo());
      expect(result.current.history).toHaveLength(1);
    });

    it('supports multiple consecutive undo steps', () => {
      const { result } = renderHook(() => useListManager());
      act(() => result.current.addItem('Item A'));
      act(() => result.current.addItem('Item B'));
      act(() => result.current.undo());
      act(() => result.current.undo());
      expect(result.current.items).toHaveLength(4);
      expect(result.current.history).toHaveLength(0);
    });

    it('can undo a delete', () => {
      const { result } = renderHook(() => useListManager());
      const itemId = result.current.items[0].id;
      act(() => result.current.toggleSelect(itemId));
      act(() => result.current.deleteSelected());
      expect(result.current.items).toHaveLength(3);
      act(() => result.current.undo());
      expect(result.current.items).toHaveLength(4);
    });
  });

  describe('modal', () => {
    it('opens the modal', () => {
      const { result } = renderHook(() => useListManager());
      act(() => result.current.openModal());
      expect(result.current.isModalOpen).toBe(true);
    });

    it('closes the modal', () => {
      const { result } = renderHook(() => useListManager());
      act(() => result.current.openModal());
      act(() => result.current.closeModal());
      expect(result.current.isModalOpen).toBe(false);
    });
  });
});
