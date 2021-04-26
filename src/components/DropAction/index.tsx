import React, { useCallback, useRef, useState } from 'react';
import {
  FaClipboardCheck,
  FaInfoCircle,
  FaTh,
  FaTimesCircle,
  FaUndo,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { OptionsType, OptionTypeBase } from 'react-select';

import { useNegociacao } from '../../hooks/negociacao';

import { OutSideClick } from '../../hooks/outSideClick';

import { Container, DropActionContent } from './styles';

interface OcorrenciaProps {
  id: number;
  finalizada: boolean;
}

interface DropActionProps {
  ocorrenciaProps: OcorrenciaProps;
  situacaoOptions: OptionsType<OptionTypeBase>;
}

const DropAction: React.FC<DropActionProps> = ({
  ocorrenciaProps,
  situacaoOptions,
}) => {
  const {
    toggleModalRetencao,
    toggleModalReversao,
    toggleModalCancelamento,
    toggleModalOutrosSelected,
  } = useNegociacao();

  const btnActionDropRef = useRef<HTMLButtonElement>(null);
  const [positionContent, setPositionContent] = useState(0);
  const { visible, setVisible, ref } = OutSideClick(false);

  const handleClickButton = useCallback(() => {
    if (btnActionDropRef.current) {
      setPositionContent(btnActionDropRef.current.getBoundingClientRect().top);
    }
    setVisible((prevState: boolean) => !prevState);
  }, [setVisible]);

  return (
    <Container ref={ref}>
      <button
        ref={btnActionDropRef}
        className="openDropAction"
        type="button"
        onClick={handleClickButton}
      >
        <FaTh />
        <span>Ações</span>
      </button>
      {visible && (
        <DropActionContent position={positionContent}>
          <Link
            className="btnDropAction"
            to={`/ocorrencias/${ocorrenciaProps.id}/detalhes`}
          >
            <FaInfoCircle className="drop info" />
            Detalhar
          </Link>
          {ocorrenciaProps.finalizada && (
            <>
              <span className="dropTitle">Finalizar Como:</span>
              <button
                className="btnDropAction"
                type="button"
                onClick={toggleModalRetencao}
              >
                <FaClipboardCheck className="drop" />
                Retenção
              </button>
              <button
                className="btnDropAction"
                type="button"
                onClick={toggleModalReversao}
              >
                <FaUndo className="drop rev" />
                Reversão
              </button>
              <button
                className="btnDropAction"
                type="button"
                onClick={toggleModalCancelamento}
              >
                <FaTimesCircle className="drop cancel" />
                Cancelamento
              </button>
              <span className="dropTitle">Outros:</span>
              <div className="otherOptions">
                <Select
                  options={situacaoOptions}
                  menuPlacement="auto"
                  placeholder="Situação"
                  onChange={toggleModalOutrosSelected}
                />
              </div>
            </>
          )}
        </DropActionContent>
      )}
    </Container>
  );
};

export default DropAction;
