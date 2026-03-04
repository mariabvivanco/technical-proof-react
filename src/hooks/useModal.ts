import { useState, useCallback } from 'react';

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  return {
    isOpen,
    open: useCallback(() => setIsOpen(true), []),
    close: useCallback(() => setIsOpen(false), []),
  };
};

export default useModal;
