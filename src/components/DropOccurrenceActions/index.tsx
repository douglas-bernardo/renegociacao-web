import React, { useCallback, useRef, useState } from 'react';
import { HiDotsVertical } from 'react-icons/hi';
import { BiDetail } from 'react-icons/bi';
import { RiCustomerServiceFill } from 'react-icons/ri';
import { FiCheckSquare } from 'react-icons/fi';

import { Link } from 'react-router-dom';

import ModalConfirm from '../ModalConfirm';

import { useNegotiation } from '../../hooks/negotiation';

import { OutSideClick } from '../../hooks/outSideClick';

import { Container, DropActionContent } from './styles';

interface Occurrence {
  id: number;
  status_ocorrencia_id: number;
  numeroprojeto?: number;
}

interface Options {
  value: string;
  label: string;
}

interface DropActionProps {
  occurrenceProps: Occurrence;
  limit: number;
  offset: number;
  firstPageRangeDisplayed?: number;
  currentPage?: number;
  statusFilterSelected?: Options[];
  [key: string]: any;
}

const DropOccurrenceActions: React.FC<DropActionProps> = ({
  occurrenceProps,
  limit,
  offset,
  firstPageRangeDisplayed,
  currentPage,
  statusFilterSelected,
  handleEndOccurrence,
}) => {
  const { toggleModalNegotiationRegister } = useNegotiation();
  const { visible, setVisible, ref } = OutSideClick(false);
  const btnActionDropRef = useRef<HTMLButtonElement>(null);

  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [positionContent, setPositionContent] = useState(0);

  const handleClickButton = useCallback(() => {
    if (btnActionDropRef.current) {
      setPositionContent(btnActionDropRef.current.getBoundingClientRect().top);
    }
    setVisible((prevState: boolean) => !prevState);
  }, [setVisible]);

  const toggleModalConfirm = useCallback(() => {
    setShowModalConfirm(!showModalConfirm);
  }, [showModalConfirm]);

  const handleModalConfirmYes = useCallback(() => {
    toggleModalConfirm();
    handleEndOccurrence(occurrenceProps.id);
  }, [toggleModalConfirm, handleEndOccurrence, occurrenceProps.id]);

  return (
    <Container ref={ref}>
      <ModalConfirm
        title="Encerrar sem negociação?"
        message="A Ocorrência será encerrada sem negociação. Confirma o encerramento?"
        confirmYes="Confirmar"
        confirmNo="Cancelar"
        isOpen={showModalConfirm}
        setIsOpen={toggleModalConfirm}
        handleConfirmYes={handleModalConfirmYes}
      />
      <button
        ref={btnActionDropRef}
        className="openDropAction"
        type="button"
        onClick={handleClickButton}
      >
        <HiDotsVertical />
      </button>
      {visible && (
        <DropActionContent position={positionContent}>
          <Link
            className="btnDropAction"
            to={{
              pathname: `/occurrences/${occurrenceProps.id}`,
              state: {
                limit,
                offset,
                firstPageRangeDisplayed,
                currentPage,
                statusFilterSelected,
              },
            }}
          >
            <BiDetail className="drop info" />
            Detalhes
          </Link>
          {Number(occurrenceProps.status_ocorrencia_id) === 1 && (
            <>
              <button
                disabled={!occurrenceProps.numeroprojeto}
                style={{
                  cursor: !occurrenceProps.numeroprojeto
                    ? 'not-allowed'
                    : 'pointer',
                }}
                className="btnDropAction"
                type="button"
                onClick={toggleModalNegotiationRegister}
              >
                <RiCustomerServiceFill className="drop" />
                Registrar Negociação
              </button>
              <button
                className="btnDropAction"
                type="button"
                onClick={toggleModalConfirm}
              >
                <FiCheckSquare className="drop cancel" />
                Encerrar
              </button>
            </>
          )}
        </DropActionContent>
      )}
    </Container>
  );
};

export default DropOccurrenceActions;
