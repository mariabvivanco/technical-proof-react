import type { ListItem } from '../types';

export const INITIAL_ITEMS: ListItem[] = [
  { id: crypto.randomUUID(), text: 'Item 1' },
  { id: crypto.randomUUID(), text: 'Item 2' },
  { id: crypto.randomUUID(), text: 'Item 3' },
  { id: crypto.randomUUID(), text: 'Item 4' },
];

export const createItem = (text: string): Promise<ListItem> =>
  new Promise(resolve =>
    setTimeout(() => resolve({ id: crypto.randomUUID(), text }), 400)
  );
