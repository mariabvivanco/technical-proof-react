import { useState, useActionState } from 'react';
import styles from './AddItemModal.module.scss';

interface ModalContentProps {
  onAdd: (text: string) => Promise<void>;
  onClose: () => void;
}

const ModalContent = ({ onAdd, onClose }: ModalContentProps) => {
  const [value, setValue] = useState('');

  const [, formAction, isPending] = useActionState(
    async (_: unknown, formData: FormData) => {
      const text = (formData.get('text') as string).trim();
      if (!text) return;
      await onAdd(text);
      setValue('');
    },
    null,
  );

  return (
    <div
      className={`${styles.overlay} ${styles['overlay--open']}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <form
        className={styles['modal-paper']}
        action={formAction}
        onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
      >
        <p className={styles['modal-title']}>Add item to list</p>

        <input
          name="text"
          autoFocus
          className={styles['modal-input']}
          placeholder="Type the text here..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <div className={styles['modal-actions']}>
          <button
            className={styles['btn-modal-add']}
            type="submit"
            disabled={isPending || !value.trim()}
          >
            {isPending ? 'Adding…' : 'Add'}
          </button>
          <button
            className={styles['btn-modal-cancel']}
            type="button"
            onClick={() => { setValue(''); onClose(); }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ModalContent;