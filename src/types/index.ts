export interface ListItem {
  id: string;
  text: string;
}

export interface ListManagerState {
  items: ListItem[];
  selectedIds: Set<string>;
  history: ListItem[][];
  isModalOpen: boolean;
}

export interface ListManagerActions {
  addItem: (text: string) => void;
  deleteSelected: () => void;
  toggleSelect: (id: string) => void;
  deleteByDoubleClick: (id: string) => void;
  undo: () => void;
  openModal: () => void;
  closeModal: () => void;
}

export type UseListManagerReturn = ListManagerState & ListManagerActions;
