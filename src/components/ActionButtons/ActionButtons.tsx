import styles from './ActionButtons.module.scss';

const UndoIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 19 19" fill="currentColor">
    <path d="M9.533,15.25c2.742,0,4.977-2.367,4.977-5.125c0-2.756-2.234-5.063-4.977-5.063c-0.928,0-1.99,0.621-2.803,1.113L8.479,8.5H2.5l0.996-6.25l1.949,2.223c1.149-0.844,2.559-1.41,4.088-1.41c3.842,0,6.967,3.109,6.967,6.969c0,3.86-3.125,7.234-6.967,7.234c-2.772,0-5.164-1.766-6.286-3.766h2.329C6.486,14.5,7.914,15.25,9.533,15.25z"/>
  </svg>
);

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
          <UndoIcon />
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
