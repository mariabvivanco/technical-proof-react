import ReplayIcon from '@mui/icons-material/Replay';
import styles from './ActionButtons.module.scss';

interface ActionButtonsProps {
  hasSelected: boolean;
  canUndo: boolean;
  onUndo: () => void;
  onDelete: () => void;
  onAdd: () => void;
}

const ActionButtons = ({ hasSelected, canUndo, onUndo, onDelete, onAdd }: ActionButtonsProps) => {
  return (
    <div className={styles.actions}>
      <div className={styles['left-group']}>
        <button
          className={styles['btn-undo']}
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Undo"
        >
          <ReplayIcon fontSize="small" />
        </button>

        <button
          className={styles['btn-delete']}
          onClick={onDelete}
          disabled={!hasSelected}
        >
          Delete
        </button>
      </div>

      <button
        className={styles['btn-add']}
        onClick={onAdd}
      >
        Add
      </button>
    </div>
  );
};

export default ActionButtons;
