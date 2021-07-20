import React, { useCallback } from 'react';
import Modal from '../Modal';

import { Container, ButtonsProps } from './styles';

interface ConfirmModalProps {
  title?: string;
  message?: string;
  note?: string;
  confirmYes?: string;
  confirmNo?: string;
  isOpen: boolean;
  setIsOpen: () => void;
  handleConfirmYes: () => void;
  buttonType?: ButtonsProps;
}

const ModalConfirm: React.FC<ConfirmModalProps> = ({
  isOpen,
  setIsOpen,
  title,
  message,
  note,
  confirmYes,
  confirmNo,
  handleConfirmYes,
  buttonType,
}) => {
  const handleConfimYes = useCallback(() => {
    handleConfirmYes();
  }, [handleConfirmYes]);

  const handleConfimNo = useCallback(() => {
    setIsOpen();
  }, [setIsOpen]);

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      shouldCloseOnOverlayClick={false}
      width="500px"
    >
      <Container buttonType={buttonType}>
        <header>
          <h2>{title || 'Action'}</h2>
        </header>
        <main>
          <p>{message || 'Confirm action?'}</p>
          <small>{note || ''}</small>
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
