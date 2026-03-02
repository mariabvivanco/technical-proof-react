import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import styles from './AddItemModal.module.scss';

interface AddItemModalProps {
  open: boolean;
  onAdd: (text: string) => void;
  onClose: () => void;
}

const AddItemModal = ({ open, onAdd, onClose }: AddItemModalProps) => {
  const [value, setValue] = useState('');
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      const timer = setTimeout(() => setMounted(false), 400);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleAdd = () => {
    if (value.trim()) {
      onAdd(value);
      setValue('');
    }
  };

  const handleClose = () => {
    setValue('');
    onClose();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd();
    if (e.key === 'Escape') handleClose();
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className={`${styles.overlay} ${open ? styles['overlay--open'] : styles['overlay--closing']}`}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className={styles['modal-paper']}>
        <p className={styles['modal-title']}>Add item to list</p>

        <input
          ref={inputRef}
          className={styles['modal-input']}
          placeholder="Type the text here..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <div className={styles['modal-actions']}>
          <button
            className={styles['btn-modal-add']}
            onClick={handleAdd}
            disabled={!value.trim()}
          >
            Add
          </button>
          <button
            className={styles['btn-modal-cancel']}
            onClick={handleClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AddItemModal;
