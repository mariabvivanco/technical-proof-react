import styles from './AddItemModal.module.scss';

interface ModalActionsProps {
  isPending: boolean;
  canSubmit: boolean;
  onCancel: () => void;
}

const ModalActions = ({ isPending, canSubmit, onCancel }: ModalActionsProps) => (
  <div className={styles['modal-actions']}>
    <button
      className={styles['btn-modal-add']}
      type="submit"
      disabled={isPending || !canSubmit}
    >
      {isPending ? 'Adding…' : 'Add'}
    </button>
    <button
      className={styles['btn-modal-cancel']}
      type="button"
      onClick={onCancel}
    >
      Cancel
    </button>
  </div>
);

export default ModalActions;
