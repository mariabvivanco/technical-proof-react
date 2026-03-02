import type { ListItem as ListItemType } from '../../types';
import styles from './ListItem.module.scss';

interface ListItemProps {
  item: ListItemType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDoubleClick: (id: string) => void;
}

const ListItem = ({ item, isSelected, onSelect, onDoubleClick }: ListItemProps) => {
  const className = [styles.item, isSelected ? styles['item--selected'] : ''].join(' ');

  return (
    <li
      className={className}
      onClick={() => onSelect(item.id)}
      onDoubleClick={() => onDoubleClick(item.id)}
    >
      {item.text}
    </li>
  );
};

export default ListItem;
