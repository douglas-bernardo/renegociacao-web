import React, { useCallback } from 'react';
import Modal from '../Modal';

import { Container } from './styles';

interface ConfirmModalProps {
  title?: string;
  message?: string;
  confirmYes?: string;
  confirmNo?: string;
  isOpen: boolean;
  setIsOpen: () => void;
  handleConfirmYes: () => void;
}

const ModalConfirm: React.FC<ConfirmModalProps> = ({
  isOpen,
  setIsOpen,
  title,
  message,
  confirmYes,
  confirmNo,
  handleConfirmYes,
}) => {
  const handleConfimYes = useCallback(() => {
    handleConfirmYes();
  }, [handleConfirmYes]);

  const handleConfimNo = useCallback(() => {
    setIsOpen();
  }, [setIsOpen]);

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} width="500px">
      <Container>
        <header>
          <h3>{title || 'Action'}</h3>
        </header>
        <main>
          <p>{message || 'Confirm action?'}</p>
        </main>
        <footer>
          <button
            className="confirmYes"
            type="button"
            onClick={handleConfimYes}
          >
            {confirmYes || 'Yes'}
          </button>
          <button className="confirmNo" type="button" onClick={handleConfimNo}>
            {confirmNo || 'No'}
          </button>
        </footer>
      </Container>
    </Modal>
  );
};

export default ModalConfirm;
