import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import format from 'date-fns/format';
import { parseISO } from 'date-fns';
import { OptionTypeBase } from 'react-select';

import Select from 'react-select';

import { FaClipboardCheck, FaTimesCircle, FaUndo } from 'react-icons/fa';

import { useNegotiation } from '../../hooks/negotiation';
import { Container, Content } from '../../components/Container';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Whoops from '../../components/Whoops';

import {
  Main,
  MainHeader,
  BoardDetails,
  Sections,
  SectionLeft,
  ActionsGroup,
  SectionRight,
  ActionGroupOthers,
} from './styles';

import { Card, CardBody, CardHeader } from '../../components/Container';

import Tag from '../../components/Tag';
import { api } from '../../services/api';

import Loading from '../../components/Loading';
import { numberFormat } from '../../utils/numberFormat';
import ModalRetentionContract from '../../components/ModalRetentionContract';
import ModalDowngradeContract from '../../components/ModalDowngradeContract';
import ModalCancelContract from '../../components/ModalCancelContract';
import ModalDefaultNegotiationClose from '../../components/ModalDefaultNegotiationClose';
import NegotiationContainerDetails from './NegotiationContainerDetails';

interface Situation {
  id: number;
  nome: string;
}

interface Negotiation {
  id: number;
  origem_id: number;
  origem: string;
  tipo_solicitacao_id: number;
  tipo_solicitacao: string;
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
  numero_ocorrencia: number;
  data_ocorrencia: string;
  data_ocorrencia_formatted: string;
  nomeusuario_cadastro: string;
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

interface NegotiationParams {
  id: string;
}

interface Options {
  value: string;
  label: string;
}

interface LocationProps {
  limit: number;
  offset: number;
  firstPageRangeDisplayed: number;
  currentPage: number;
  situationFilter: Options[];
  requestTypeFilter: Options[];
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

const selectCustomStyles = {
  container: base => ({
    ...base,
    flex: 1,
  }),
};

const NegotiationDetails: React.FC = () => {
  const {
    toggleModalRetentionContract,
    toggleModalDowngradeContract,
    toggleModalCancelContract,
    toggleModalOutrosSelected,
  } = useNegotiation();
  const params = useParams<NegotiationParams>();
  const location = useLocation<LocationProps>();

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorCode, setErrorCode] = useState(0);
  const [refreshPageData, setRefreshPageData] = useState(false);

  const [situationOptions, setSituationOptions] = useState<OptionTypeBase[]>(
    [],
  );

  const [negotiation, setNegotiation] = useState<Negotiation | null>(null);

  useEffect(() => {
    api
      .get<Request>(`/negotiations/${params.id}`)
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
        }
      });
  }, [params.id, refreshPageData]);

  useEffect(() => {
    api
      .get(`/domain/situation`)
      .then(response => {
        const { data } = response.data;

        const options = data.map((opt: Situation) => {
          return { value: opt.id, label: opt.nome };
        });
        setSituationOptions(options);
      })
      .catch((error: Error) => {
        setIsLoading(false);
        setIsError(true);
        console.log(error.message);
      });
  }, []);

  const refreshPage = useCallback(() => {
    setRefreshPageData(!refreshPageData);
  }, [refreshPageData]);

  return (
    <Container>
      <Sidebar />
      {negotiation && (
        <>
          <ModalRetentionContract
            negotiation={negotiation}
            refreshPage={refreshPage}
          />
          <ModalDowngradeContract
            negotiation={negotiation}
            refreshPage={refreshPage}
          />
          <ModalCancelContract
            negotiation={negotiation}
            refreshPage={refreshPage}
          />
          <ModalDefaultNegotiationClose
            negotiation={negotiation}
            refreshPage={refreshPage}
            situacaoOptions={situationOptions}
          />
        </>
      )}
      <Content>
        <Header />
        <Main>
          <MainHeader>
            <h1>Negociação | Detalhes</h1>
          </MainHeader>
          <BoardDetails>
            {isLoading && <Loading />}
            {isError && (
              <Whoops errorMessage="Algo errado" errorCode={errorCode} />
            )}
            {negotiation && (
              <Sections>
                <SectionLeft>
                  <header>
                    <div style={{ marginBottom: '10px' }}>
                      <Link
                        to={{
                          pathname: '/negotiations',
                          state: {
                            limit: location.state.limit,
                            offset: location.state.offset,
                            firstPageRangeDisplayed:
                              location.state.firstPageRangeDisplayed,
                            currentPage: location.state.currentPage,
                            situationFilter: location.state.situationFilter,
                            requestTypeFilter: location.state.requestTypeFilter,
                          },
                        }}
                      >
                        Voltar
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
                    {Number(negotiation.situacao_id) === 1 && (
                      <>
                        <ActionsGroup>
                          <strong>Finalizar como:</strong>
                          <button
                            type="button"
                            onClick={toggleModalRetentionContract}
                          >
                            <FaClipboardCheck className="drop" />
                            Retenção
                          </button>
                          <button
                            type="button"
                            onClick={toggleModalDowngradeContract}
                          >
                            <FaUndo className="drop rev" />
                            Reversão
                          </button>
                          <button
                            type="button"
                            onClick={toggleModalCancelContract}
                          >
                            <FaTimesCircle className="drop cancel" />
                            Cancelamento
                          </button>
                        </ActionsGroup>
                        <ActionGroupOthers>
                          <strong>Finalizar Outros:</strong>
                          <Select
                            options={situationOptions}
                            styles={selectCustomStyles}
                            placeholder="Situação"
                            onChange={toggleModalOutrosSelected}
                            value={null}
                          />
                        </ActionGroupOthers>
                      </>
                    )}
                  </header>
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
                        <span>Responsável:</span>
                        <div>{negotiation.usuario_resp_negociacao}</div>
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
                </SectionLeft>
                <SectionRight>
                  <header>Dados da Negociação</header>
                  <hr />
                  <NegotiationContainerDetails
                    negotiation={negotiation}
                    refreshPage={refreshPage}
                  />
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
