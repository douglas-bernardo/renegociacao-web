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

import { useNegotiation } from '../../hooks/negotiation';

import { OutSideClick } from '../../hooks/outSideClick';

import { Container, DropActionContent } from './styles';

interface NegotiationProps {
  id: number;
  situation_id: number;
}

interface Options {
  value: string;
  label: string;
}

interface DropActionProps {
  negotiationProps: NegotiationProps;
  situacaoOptions: OptionsType<OptionTypeBase>;
  limit: number;
  offset: number;
  firstPageRangeDisplayed?: number;
  currentPage?: number;
  situationFilter?: Options[];
  requestTypeFilter?: Options[];
}

const DropNegotiationsActions: React.FC<DropActionProps> = ({
  negotiationProps,
  situacaoOptions,
  limit,
  offset,
  firstPageRangeDisplayed,
  currentPage,
  situationFilter,
  requestTypeFilter,
}) => {
  const {
    toggleModalRetentionContract,
    toggleModalDowngradeContract,
    toggleModalCancelContract,
    toggleModalOutrosSelected,
  } = useNegotiation();

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
        <span>Gerenciar</span>
      </button>
      {visible && (
        <DropActionContent position={positionContent}>
          <Link
            className="btnDropAction"
            to={{
              pathname: `/negotiations/${negotiationProps.id}`,
              state: {
                limit,
                offset,
                firstPageRangeDisplayed,
                currentPage,
                situationFilter,
                requestTypeFilter,
              },
            }}
          >
            <FaInfoCircle className="drop info" />
            Detalhes
          </Link>
          {Number(negotiationProps.situation_id) === 1 && (
            <>
              <span className="dropTitle">Finalizar Como:</span>
              <button
                className="btnDropAction"
                type="button"
                onClick={toggleModalRetentionContract}
              >
                <FaClipboardCheck className="drop" />
                Retenção
              </button>
              <button
                className="btnDropAction"
                type="button"
                onClick={toggleModalDowngradeContract}
              >
                <FaUndo className="drop rev" />
                Reversão
              </button>
              <button
                className="btnDropAction"
                type="button"
                onClick={toggleModalCancelContract}
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

export default DropNegotiationsActions;
