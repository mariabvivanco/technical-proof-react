import { useState, useActionState } from 'react';
import styles from './AddItemModal.module.scss';
import ModalActions from './ModalActions';

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

  const handleCancel = () => { setValue(''); onClose(); };

  return (
    <div
      className={`${styles.overlay} ${styles['overlay--open']}`}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <form
        className={styles['modal-paper']}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        action={formAction}
        onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }}
      >
        <p id="modal-title" className={styles['modal-title']}>Add item to list</p>

        <input
          name="text"
          autoFocus
          required
          aria-required="true"
          className={styles['modal-input']}
          placeholder="Type the text here..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <ModalActions isPending={isPending} canSubmit={!!value.trim()} onCancel={handleCancel} />
      </form>
    </div>
  );
};

export default ModalContent;