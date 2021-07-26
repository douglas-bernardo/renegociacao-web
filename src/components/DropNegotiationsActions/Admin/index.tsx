import React from 'react';
import {
  FaExchangeAlt,
  FaInfoCircle,
  FaTh,
  FaTrashAlt,
  FaUndo,
} from 'react-icons/fa';

import ReactTooltip from 'react-tooltip';
import { Link } from 'react-router-dom';

import DropMenu from '../../DropMenu';

import { Container } from '../styles';

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
  limit: number;
  offset: number;
  firstPageRangeDisplayed?: number;
  currentPage?: number;
  situationFilter?: Options[];
  requestTypeFilter?: Options[];
  userRespFilterSelected?: Options | undefined;
  toggleModalTransferNegotiation: () => void;
  toggleModalConfirmDeleteNegotiation: () => void;
  toggleModalConfirmRestoreNegotiation: () => void;
}

const DropNegotiationsActions: React.FC<DropActionProps> = ({
  negotiationProps,
  limit,
  offset,
  firstPageRangeDisplayed,
  currentPage,
  situationFilter,
  requestTypeFilter,
  userRespFilterSelected,
  toggleModalTransferNegotiation,
  toggleModalConfirmDeleteNegotiation,
  toggleModalConfirmRestoreNegotiation,
}) => {
  return (
    <DropMenu icon={<FaTh size={18} />} iconLabel="Gerenciar">
      <Container>
        <span className="dropTitle">Ações:</span>
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
        {Number(negotiationProps.situation_id) === 1 ? (
          <>
            <button
              className="btnDropAction"
              type="button"
              data-tip
              data-for="TransferirInfo"
              onClick={toggleModalTransferNegotiation}
            >
              <FaExchangeAlt className="drop" />
              Transferir
            </button>
            <ReactTooltip
              id="TransferirInfo"
              type="info"
              effect="solid"
              delayShow={1000}
            >
              <span>Transferir negociação para outro negociador</span>
            </ReactTooltip>
            <button
              className="btnDropAction"
              type="button"
              onClick={toggleModalConfirmDeleteNegotiation}
            >
              <FaTrashAlt className="drop cancel" />
              Excluir
            </button>
          </>
        ) : (
          <>
            <button
              className="btnDropAction"
              type="button"
              data-tip
              data-for="ReverterInfo"
              onClick={toggleModalConfirmRestoreNegotiation}
            >
              <FaUndo className="drop rev" />
              Restaurar p/ Ag. Ret.
            </button>
            <ReactTooltip
              id="ReverterInfo"
              type="info"
              effect="solid"
              delayShow={1000}
            >
              <span>Restaura a negociação para Aguardando Retorno</span>
            </ReactTooltip>
          </>
        )}
      </Container>
    </DropMenu>
  );
};

export default DropNegotiationsActions;
