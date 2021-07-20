import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import { parseISO } from 'date-fns';

import { FaInfoCircle } from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';

import { TiArrowLeftThick } from 'react-icons/ti';

import { Container, Content, MainHeader } from '../../../components/Container';
import Sidebar from '../../../components/Sidebar';
import Header from '../../../components/Header';
import Whoops from '../../../components/Whoops';

import {
  Main,
  BoardDetails,
  Sections,
  SectionLeft,
  SectionRight,
} from '../styles';

import { Card, CardBody, CardHeader } from '../../../components/Container';

import Tag from '../../../components/Tag';
import { api } from '../../../services/api';

import Loading from '../../../components/Loading';
import { numberFormat } from '../../../utils/numberFormat';

interface Negotiation {
  id: number;
  origem_id: number;
  origem: string;
  tipo_solicitacao_id: number;
  tipo_solicitacao: string;
  motivo_id: number;
  motivo: string;
  usuario_resp_negociacao: string;
  situacao_id: number;
  data_finalizacao: string;
  situacao: string;
  reembolso: number;
  numero_pc: number;
  taxas_extras: number;
  valor_primeira_parcela: number;
  multa: number;
  observacao: string;
  transferida: boolean;
  numero_ocorrencia: number;
  data_ocorrencia: string;
  data_ocorrencia_formatted: string;
  nomeusuario_cadastro: string;
  usuario_resp_ts: string;
  departamento: string;
  nome_cliente: string;
  numeroprojeto: string;
  numerocontrato: string;
  produto: string;
  valor_venda: number;
  valor_venda_formatted: string;
  status_ts: string;
}

interface Request {
  status: string;
  data: Negotiation;
}

interface Options {
  value: string;
  label: string;
}

interface LocationProps {
  negotiationId?: number | undefined;
  limit?: number;
  offset?: number;
  firstPageRangeDisplayed?: number;
  currentPage?: number;
  situationFilter?: Options[];
  requestTypeFilter?: Options[];
  userRespFilterSelected: Options | undefined;
}

const situationStyle = {
  '1': 'warning',
  '6': 'success',
  '7': 'info',
};

const statusTimesharingTypes = {
  C: 'Cancelada',
  F: 'Finalizada',
  P: 'Pendente',
};

const NegotiationDetails: React.FC = () => {
  const history = useHistory();
  const location = useLocation<LocationProps>();

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorCode, setErrorCode] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const [negotiation, setNegotiation] = useState<Negotiation>();

  useEffect(() => {
    if (!location.state?.negotiationId) {
      history.push('/');
    }
    api
      .get<Request>(`/negotiations/${location.state?.negotiationId}`)
      .then(response => {
        const { data } = response.data;
        const negotiationFormatted: Negotiation = {
          ...data,
          valor_venda_formatted: numberFormat(data.valor_venda),
          data_ocorrencia_formatted: format(
            parseISO(data.data_ocorrencia),
            'dd-MM-yyyy HH:mm:ss',
          ),
        };

        setNegotiation(negotiationFormatted);
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        setIsError(true);
        if (error.response) {
          setErrorCode(error.response.status);
          setErrorMessage(error.response.data.message);
        }
      });
  }, [history, location.state?.negotiationId]);

  return (
    <Container>
      <Sidebar />
      <Content>
        <Header />
        <Main>
          <MainHeader>
            <h1>Negociação | Detalhes</h1>
          </MainHeader>
          <BoardDetails>
            {isLoading && <Loading />}
            {isError && (
              <Whoops errorMessage={errorMessage} errorCode={errorCode} />
            )}
            {negotiation && (
              <Sections>
                <SectionLeft situacao_id={negotiation.situacao_id}>
                  <header>
                    <div className="linkBackPage">
                      <Link
                        to={{
                          pathname: '/negotiations',
                          state: {
                            limit: location.state?.limit
                              ? location.state?.limit
                              : 10,
                            offset: location.state?.offset
                              ? location.state?.offset
                              : 0,
                            firstPageRangeDisplayed: location.state
                              ?.firstPageRangeDisplayed
                              ? location.state?.firstPageRangeDisplayed
                              : 0,
                            currentPage: location.state?.currentPage
                              ? location.state?.currentPage
                              : 1,
                            situationFilter: location.state?.situationFilter
                              ? location.state?.situationFilter
                              : [],
                            requestTypeFilter: location.state?.requestTypeFilter
                              ? location.state?.requestTypeFilter
                              : [],
                            userRespFilterSelected: location.state
                              ?.userRespFilterSelected
                              ? location.state?.userRespFilterSelected
                              : undefined,
                          },
                        }}
                      >
                        <TiArrowLeftThick size={25} />
                        <span>Voltar</span>
                      </Link>
                    </div>
                    <Tag
                      className="tagSituacao"
                      theme={
                        situationStyle[negotiation.situacao_id] || 'default'
                      }
                    >
                      {negotiation.situacao}
                    </Tag>
                    <Card className="negotiationDetailsAdmin">
                      <CardHeader>
                        <h3>Negociação</h3>
                      </CardHeader>
                      <CardBody>
                        <div className="row">
                          <span>Motivo:</span>
                          <div>{negotiation.motivo}</div>
                        </div>
                        <div className="row">
                          <span>Tipo de Solicitação:</span>
                          <div>{`${negotiation.tipo_solicitacao}`}</div>
                        </div>
                        <div className="row">
                          <span>Origem:</span>
                          <div>{negotiation.origem}</div>
                        </div>
                      </CardBody>
                    </Card>
                  </header>
                </SectionLeft>
                <SectionRight>
                  <header>
                    Dados da Ocorrência
                    {Number(negotiation.transferida) ? (
                      <div className="negotiationInfo">
                        <span data-tip data-for="negotiationInfo">
                          <FaInfoCircle />
                        </span>
                        <ReactTooltip
                          id="negotiationInfo"
                          type="error"
                          effect="solid"
                          delayShow={1000}
                        >
                          <span>Negociação Transferida</span>
                        </ReactTooltip>
                      </div>
                    ) : (
                      ''
                    )}
                  </header>
                  <hr />
                  <Card>
                    <CardHeader>
                      <h3>Contrato</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="row">
                        <span>Cliente:</span>
                        <div>{negotiation.nome_cliente}</div>
                      </div>
                      <div className="row">
                        <span>Contrato:</span>
                        <div>
                          {`${negotiation.numeroprojeto}-${negotiation.numerocontrato}`}
                        </div>
                      </div>
                      <div className="row">
                        <span>Valor de Venda:</span>
                        <div>{negotiation.valor_venda_formatted}</div>
                      </div>
                      <div className="row">
                        <span>Produto:</span>
                        <div>{negotiation.produto}</div>
                      </div>
                    </CardBody>
                  </Card>
                  <Card>
                    <CardHeader>
                      <h3>Ocorrência</h3>
                    </CardHeader>
                    <CardBody>
                      <div className="row">
                        <span>Número:</span>
                        <div>{negotiation.numero_ocorrencia}</div>
                      </div>
                      <div className="row">
                        <span>Data:</span>
                        <div>{negotiation.data_ocorrencia_formatted}</div>
                      </div>
                      <div className="row">
                        <span>Status Timesharing:</span>
                        <div>
                          {statusTimesharingTypes[negotiation.status_ts]}
                        </div>
                      </div>
                      <div className="row">
                        <span>Motivo:</span>
                        <div>{negotiation.motivo}</div>
                      </div>
                      <div className="row">
                        <span>Responsável TS:</span>
                        <div>{negotiation.usuario_resp_ts}</div>
                      </div>
                      <div className="row">
                        <span>Usuário Cadastro:</span>
                        <div>{negotiation.nomeusuario_cadastro}</div>
                      </div>
                      <div className="row">
                        <span>Departamento:</span>
                        <div>{negotiation.departamento}</div>
                      </div>
                    </CardBody>
                  </Card>
                </SectionRight>
              </Sections>
            )}
          </BoardDetails>
        </Main>
      </Content>
    </Container>
  );
};

export default NegotiationDetails;
