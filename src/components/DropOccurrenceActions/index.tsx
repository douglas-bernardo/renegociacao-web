import React from 'react';
import { BiDetail } from 'react-icons/bi';
import { RiCustomerServiceFill } from 'react-icons/ri';

import { FiCheckSquare } from 'react-icons/fi';

import { Link } from 'react-router-dom';

import { useNegotiation } from '../../hooks/negotiation';

import { Container } from './styles';

import DropMenu from '../DropMenu';

import PermissionComponent from '../PermissionComponent';

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
  userRespFilterSelected?: Options | undefined;
  toggleModalConfirm: () => void;
}

const DropOccurrenceActions: React.FC<DropActionProps> = ({
  occurrenceProps,
  limit,
  offset,
  firstPageRangeDisplayed,
  currentPage,
  statusFilterSelected,
  userRespFilterSelected,
  toggleModalConfirm,
}) => {
  const { toggleModalNegotiationRegister } = useNegotiation();

  return (
    <DropMenu>
      <Container>
        <Link
          className="btnDropAction"
          to={{
            pathname: `/occurrences/details`,
            state: {
              occurrenceId: occurrenceProps.id,
              limit,
              offset,
              firstPageRangeDisplayed,
              currentPage,
              statusFilterSelected,
              userRespFilterSelected,
            },
          }}
        >
          <BiDetail className="drop info" />
          Detalhes
        </Link>
        <PermissionComponent roles={['ROLE_CONSULTOR']} isExactlyRoles>
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
        </PermissionComponent>
      </Container>
    </DropMenu>
  );
};

export default DropOccurrenceActions;
