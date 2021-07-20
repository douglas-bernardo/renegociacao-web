import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';

import { Container } from './styles';

interface IModalProps {
  width?: string;
  isOpen: boolean;
  setIsOpen?: () => void;
}

const LoadingModal: React.FC<IModalProps> = ({ width, isOpen }) => {
  const [modalStatus, setModalStatus] = useState(isOpen);

  useEffect(() => {
    setModalStatus(isOpen);
  }, [isOpen]);

  return (
    <ReactModal
      shouldCloseOnOverlayClick={false}
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
          background: 'transparent',
          color: '#000000',
          borderRadius: '8px',
          width: width || 'auto',
          border: 'none',
          overflow: 'unset',
        },
        overlay: {
          backgroundColor: '#121214b3',
          zIndex: 2,
        },
      }}
    >
      <Container>
        <p>Processando aguarde...</p>
        <Loader type="TailSpin" color="#00BFFF" height={80} width={80} />
      </Container>
    </ReactModal>
  );
};

export default LoadingModal;
