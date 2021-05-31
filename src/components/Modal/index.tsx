import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import { FaTimes } from 'react-icons/fa';

import { CloseButtonContainer } from './styles';

interface IModalProps {
  width?: string;
  children: any;
  isOpen: boolean;
  setIsOpen: () => void;
}

const Modal: React.FC<IModalProps> = ({
  width,
  children,
  isOpen,
  setIsOpen,
}) => {
  const [modalStatus, setModalStatus] = useState(isOpen);

  useEffect(() => {
    setModalStatus(isOpen);
  }, [isOpen]);

  return (
    <ReactModal
      shouldCloseOnOverlayClick={!false}
      onRequestClose={setIsOpen}
      isOpen={modalStatus}
      ariaHideApp={false}
      style={{
        content: {
          padding: '0',
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          background: '#F0F0F5',
          color: '#000000',
          borderRadius: '8px',
          width: width || '736px',
          border: 'none',
          overflow: 'unset',
        },
        overlay: {
          backgroundColor: '#121214e6',
          zIndex: 2,
        },
      }}
    >
      <CloseButtonContainer title="Fechar">
        <button type="button" onClick={setIsOpen}>
          <FaTimes size={25} />
        </button>
      </CloseButtonContainer>
      {children}
    </ReactModal>
  );
};

export default Modal;
