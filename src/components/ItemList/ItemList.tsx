import type { ListItem as ListItemType } from '../../types';
import ListItem from './ListItem';
import styles from './ItemList.module.scss';

interface ItemListProps {
  items: ListItemType[];
  selectedIds: Set<string>;
  onSelect: (id: string) => void;
  onDoubleClick: (id: string) => void;
}

const ItemList = ({ items, selectedIds, onSelect, onDoubleClick }: ItemListProps) => {
  return (
    <div className={styles['list-container']}>
      <ul>
        {items.map((item) => (
          <ListItem
            key={item.id}
            item={item}
            isSelected={selectedIds.has(item.id)}
            onSelect={onSelect}
            onDoubleClick={onDoubleClick}
          />
        ))}
      </ul>
    </div>
  );
};

export default ItemList;