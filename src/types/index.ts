export interface ListItem {
  id: string;
  text: string;
}

export interface ListManagerState {
  items: ListItem[];
  selectedIds: Set<string>;
  canUndo: boolean;
  isModalOpen: boolean;
}

export interface ListManagerActions {
  addItem: (text: string) => Promise<void>;
  deleteSelected: () => void;
  toggleSelect: (id: string) => void;
  deleteByDoubleClick: (id: string) => void;
  undo: () => void;
  openModal: () => void;
  closeModal: () => void;
}

export type UseListManagerReturn = ListManagerState & ListManagerActions;
