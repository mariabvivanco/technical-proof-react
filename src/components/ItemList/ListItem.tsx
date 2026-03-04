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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(item.id); }
    if (e.key === 'Delete' || e.key === 'Backspace') onDoubleClick(item.id);
  };

  return (
    <li
      className={className}
      role="option"
      aria-selected={isSelected}
      tabIndex={0}
      onClick={() => onSelect(item.id)}
      onDoubleClick={() => onDoubleClick(item.id)}
      onKeyDown={handleKeyDown}
    >
      {item.text}
    </li>
  );
};

export default ListItem;