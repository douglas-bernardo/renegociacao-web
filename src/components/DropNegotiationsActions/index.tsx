import React from 'react';
import {
  FaClipboardCheck,
  FaInfoCircle,
  FaTh,
  FaTimesCircle,
  FaFileContract,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { OptionsType, OptionTypeBase } from 'react-select';

import { useNegotiation } from '../../hooks/negotiation';

import DropMenu from '../DropMenu';

import { Container } from './styles';

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
  userRespFilterSelected?: Options | undefined;
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
  userRespFilterSelected,
}) => {
  const {
    toggleModalRetentionContract,
    toggleModalDowngradeContract,
    toggleModalCancelContract,
    toggleModalOutrosSelected,
  } = useNegotiation();

  return (
    <DropMenu icon={<FaTh size={18} />} iconLabel="Gerenciar">
      <Container>
        <Link
          className="btnDropAction"
          to={{
            pathname: `/negotiations/details`,
            state: {
              negotiationId: negotiationProps.id,
              limit,
              offset,
              firstPageRangeDisplayed,
              currentPage,
              situationFilter,
              requestTypeFilter,
              userRespFilterSelected,
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
              <FaFileContract className="drop rev" />
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
      </Container>
    </DropMenu>
  );
};

export default DropNegotiationsActions;
