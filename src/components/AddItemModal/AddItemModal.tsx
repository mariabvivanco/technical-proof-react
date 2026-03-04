import { createPortal } from 'react-dom';
import ModalContent from './ModalContent';

interface AddItemModalProps {
  open: boolean;
  onAdd: (text: string) => Promise<void>;
  onClose: () => void;
}

const AddItemModal = ({ open, onAdd, onClose }: AddItemModalProps) => {
  if (!open) return null;
  return createPortal(<ModalContent onAdd={onAdd} onClose={onClose} />, document.body);
};

export default AddItemModal;
