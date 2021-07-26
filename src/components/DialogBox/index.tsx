import React, { useCallback } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import Modal from '../Modal';

import { Container, ButtonsProps } from './styles';

interface DialogBoxProps {
  title?: string;
  message?: string;
  note?: string;
  confirmYes?: string;
  confirmNo?: string;
  isOpen: boolean;
  setIsOpen: () => void;
  buttonType?: ButtonsProps;
}

const DialogBox: React.FC<DialogBoxProps> = ({
  isOpen,
  setIsOpen,
  title,
  message,
  note,
  buttonType,
}) => {
  const handleConfimNo = useCallback(() => {
    setIsOpen();
  }, [setIsOpen]);

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      shouldCloseOnOverlayClick={false}
      width="500px"
      background="#FFF"
    >
      <Container buttonType={buttonType}>
        <header>
          <h2>{title || 'Message Title'}</h2>
        </header>
        <main>
          <span>
            <FaCheckCircle size={70} />
          </span>
          <p>{message || 'Message Box'}</p>
          <small>{note || ''}</small>
        </main>
        <footer>
          <button className="confirmNo" type="button" onClick={handleConfimNo}>
            Ok
          </button>
        </footer>
      </Container>
    </Modal>
  );
};

export default DialogBox;
