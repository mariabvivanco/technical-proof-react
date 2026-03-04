import type { ListItem } from '../types';

export const createItem = (text: string): Promise<ListItem> =>
  new Promise(resolve =>
    setTimeout(() => resolve({ id: crypto.randomUUID(), text }), 400)
  );
