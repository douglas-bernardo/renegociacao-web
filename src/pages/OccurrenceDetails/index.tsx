/* eslint-disable react/jsx-curly-newline */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import format from 'date-fns/format';
import { parseISO } from 'date-fns';

import { BiDetail } from 'react-icons/bi';
import { RiCustomerServiceFill } from 'react-icons/ri';
import { FiCheckSquare } from 'react-icons/fi';

import { useNegotiation } from '../../hooks/negotiation';
import { Container, Content } from '../../components/Container';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Whoops from '../../components/Whoops';

import { OutSideClick } from '../../hooks/outSideClick';

import {
  Main,
  MainHeader,
  BoardDetails,
  SectionLeft,
  ActionsGroup,
  SectionRight,
  LoadingContainer,
  AtendimentoContainer,
  Atendimento,
  ContainerDetails,
  DropDetails,
} from './styles';

import { Card, CardBody, CardHeader } from '../../components/Container';

import negociacaoLogo from '../../assets/money-talk.svg';
import whatsappLogo from '../../assets/whatsapp.svg';
import infoLogo from '../../assets/info.svg';
import cobrancaLogo from '../../assets/price-tag.svg';
import alertaLogo from '../../assets/warning.svg';
import outrosAtLogo from '../../assets/speak.svg';

import { api, apiTimesharing } from '../../services/api';

import Loading from '../../components/Loading';
import { numberFormat } from '../../utils/numberFormat';
import ModalNegotiationRegister from '../../components/ModalNegotiationRegister';
import ModalConfirm from '../../components/ModalConfirm';

interface Product {
  id: number;
  numeroprojeto: number;
  nomeprojeto: string;
}

interface Occurrence {
  id: number;
  dtocorrencia: string;
  idpessoa_cliente: number;
  dateFormatted: string;
  numero_ocorrencia: number;
  nome_cliente: string;
  numeroprojeto: number;
  numerocontrato: number;
  valor_venda: string;
  valorVendaFormatted: string;
  produto: Product;
  status: string;
  motivo: string;
  nomeusuario_resp: string;
  nomeusuario_cadastro: string;
  departamento: string;
  status_ocorrencia: {
    id: number;
    nome: string;
  };
}

interface Atendimento {
  idmotivots: string;
  protocolo: string;
  nomeusuario: string;
  descricao: string;
  observacao: string;
  dataobservacao: string;
  dateFormatted: string;
}

interface OccurrenceParams {
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
  statusFilterSelected: Options[];
}

const icons = {
  '182': negociacaoLogo,
  '360': negociacaoLogo,
  '78': infoLogo,
  '99': infoLogo,
  '740': infoLogo,
  '981': infoLogo,
  '93': cobrancaLogo,
  '536': cobrancaLogo,
  '564': whatsappLogo,
  '195': alertaLogo,
  outros: outrosAtLogo,
};

const statusTimesharingTypes = {
  C: 'Canceldo',
  F: 'Finalizado',
  P: 'Pendente',
};

const OccurrenceDetails: React.FC = () => {
  const { toggleModalNegotiationRegister } = useNegotiation();

  const params = useParams<OccurrenceParams>();
  const location = useLocation<LocationProps>();
  const btnActionDropRef = useRef<HTMLButtonElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorCode, setErrorCode] = useState(0);

  const [ocorrencia, setOcorrencia] = useState<Occurrence>();
  const [idPessoaCliente, setIdPessoaCliente] = useState<number | null>(null);
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);

  const { visible, setVisible, ref } = OutSideClick(false);
  const [currentAtendimento, setCurrentAtendimento] = useState('');
  const [positionContent, setPositionContent] = useState(0);

  const [refreshPageData, setRefreshPageData] = useState(false);

  const [showModalConfirm, setShowModalConfirm] = useState(false);

  useEffect(() => {
    api
      .get(`occurrences/${params.id}`)
      .then(response => {
        const { data } = response.data;
        const ocorrenciaFormatted: Occurrence = {
          ...data,
          dateFormatted: format(
            parseISO(data.dtocorrencia),
            'dd-MM-yyyy HH:mm:ss',
          ),
          valorVendaFormatted: numberFormat(data.valor_venda),
        };
        setOcorrencia(ocorrenciaFormatted);
        setIdPessoaCliente(ocorrenciaFormatted.idpessoa_cliente);
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
    if (!idPessoaCliente) return;
    apiTimesharing
      .get(`/after-sales-customer-services/${idPessoaCliente}`)
      .then(response => {
        const { data } = response.data;
        const atendimentosFormatted = data.map((atend: Atendimento) => {
          return {
            ...atend,
            dateFormatted: format(parseISO(atend.dataobservacao), 'dd-MM-yyyy'),
          };
        });
        setAtendimentos(atendimentosFormatted);
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        setIsError(true);
        if (error.response) {
          // console.log(error.response.data);
          setErrorCode(error.response.status);
          // console.log(error.response.headers);
        }
      });
  }, [idPessoaCliente]);

  const handleDetailsButton = useCallback(
    (protocolo: string) => {
      if (btnActionDropRef.current) {
        setPositionContent(
          btnActionDropRef.current.getBoundingClientRect().top,
        );
        console.log(btnActionDropRef.current.getBoundingClientRect().top);
      }
      setCurrentAtendimento(protocolo);
      setVisible(prevState => !prevState);
    },
    [setCurrentAtendimento, setVisible],
  );

  const refreshPage = useCallback(() => {
    setRefreshPageData(!refreshPageData);
  }, [refreshPageData]);

  const toggleModalConfirm = useCallback(() => {
    setShowModalConfirm(!showModalConfirm);
  }, [showModalConfirm]);

  const handleEndOccurrence = useCallback(
    async (occurrence_id: string) => {
      await api.post(`/occurrences/${occurrence_id}/close`);
      refreshPage();
    },
    [refreshPage],
  );

  const handleModalConfirmYes = useCallback(() => {
    toggleModalConfirm();
    handleEndOccurrence(params.id);
  }, [toggleModalConfirm, handleEndOccurrence, params.id]);

  return (
    <Container>
      <Sidebar />
      <ModalNegotiationRegister
        occurrence_id={Number(params.id)}
        refreshPage={refreshPage}
      />
      <ModalConfirm
        title="Encerrar sem negociação?"
        message="A Ocorrência será encerrada sem negociação. Confirma o encerramento?"
        confirmYes="Confirmar"
        confirmNo="Cancelar"
        isOpen={showModalConfirm}
        setIsOpen={toggleModalConfirm}
        handleConfirmYes={handleModalConfirmYes}
      />
      <Content>
        <Header />
        <Main>
          <MainHeader>
            <h1>Ocorrência | Detalhes</h1>
          </MainHeader>
          {isError && !ocorrencia && <Whoops errorCode={errorCode} />}
          {ocorrencia && (
            <BoardDetails>
              <SectionLeft>
                <header>
                  <div style={{ marginBottom: '10px' }}>
                    <Link
                      to={{
                        pathname: '/occurrences',
                        state: {
                          limit: location.state.limit,
                          offset: location.state.offset,
                          firstPageRangeDisplayed:
                            location.state.firstPageRangeDisplayed,
                          currentPage: location.state.currentPage,
                          statusFilterSelected:
                            location.state.statusFilterSelected,
                        },
                      }}
                    >
                      Voltar
                    </Link>
                  </div>
                  <div className="statusOccurrence">
                    Status Ocorrência:
                    <span
                      className={
                        Number(ocorrencia.status_ocorrencia.id) === 1
                          ? 'occurrence-opened'
                          : ''
                      }
                    >
                      {ocorrencia.status_ocorrencia.nome}
                    </span>
                  </div>
                  {Number(ocorrencia.status_ocorrencia.id) === 1 &&
                    ocorrencia.numeroprojeto && (
                      <>
                        <ActionsGroup>
                          <button
                            className="register"
                            type="button"
                            onClick={toggleModalNegotiationRegister}
                          >
                            <RiCustomerServiceFill />
                            Registrar Negociação
                          </button>
                          <button
                            className="close"
                            type="button"
                            onClick={toggleModalConfirm}
                          >
                            <FiCheckSquare />
                            Encerrar
                          </button>
                        </ActionsGroup>
                      </>
                    )}
                  {!ocorrencia.numeroprojeto && (
                    <p className="ocorrenciaInfo">
                      Essa ocorrência não foi vinculada à nenhum contrato.
                      Verifique no Timesharing.
                    </p>
                  )}
                </header>
                <Card>
                  <CardHeader>
                    <h3>Contrato</h3>
                  </CardHeader>
                  <CardBody>
                    <div className="row">
                      <span>Cliente:</span>
                      <div>{ocorrencia.nome_cliente}</div>
                    </div>
                    <div className="row">
                      <span>Contrato:</span>
                      <div>
                        {ocorrencia.numeroprojeto
                          ? `${ocorrencia.numeroprojeto}-${ocorrencia.numerocontrato}`
                          : 'Não Vinculada'}
                      </div>
                    </div>
                    <div className="row">
                      <span>Valor de Venda:</span>
                      <div>
                        {ocorrencia.numeroprojeto
                          ? ocorrencia.valorVendaFormatted
                          : 'Sem valor de contrato'}
                      </div>
                    </div>
                    <div className="row">
                      <span>Produto:</span>
                      <div>
                        {ocorrencia.produto
                          ? ocorrencia.produto.nomeprojeto
                          : 'Sem produto'}
                      </div>
                    </div>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>
                    <h3>Ocorrencia</h3>
                  </CardHeader>
                  <CardBody>
                    <div className="row">
                      <span>Número:</span>
                      <div>{ocorrencia.numero_ocorrencia}</div>
                    </div>
                    <div className="row">
                      <span>Data:</span>
                      <div>{ocorrencia.dateFormatted}</div>
                    </div>
                    <div className="row">
                      <span>Status Timesharing:</span>
                      <div>{statusTimesharingTypes[ocorrencia.status]}</div>
                    </div>
                    <div className="row">
                      <span>Motivo:</span>
                      <div>{ocorrencia.motivo}</div>
                    </div>
                    <div className="row">
                      <span>Responsável:</span>
                      <div>{ocorrencia.nomeusuario_resp}</div>
                    </div>
                    <div className="row">
                      <span>Usuário Cadastro:</span>
                      <div>{ocorrencia.nomeusuario_cadastro}</div>
                    </div>
                    <div className="row">
                      <span>Departamento:</span>
                      <div>{ocorrencia.departamento}</div>
                    </div>
                  </CardBody>
                </Card>
              </SectionLeft>

              <SectionRight>
                <header>
                  <h3>Atendimentos</h3>
                </header>
                <hr />
                <AtendimentoContainer ref={ref}>
                  {isLoading && (
                    <LoadingContainer>
                      <Loading />
                      <h3>Carregando atendimentos...</h3>
                    </LoadingContainer>
                  )}
                  {isError && (
                    <LoadingContainer>
                      <Whoops errorCode={errorCode} />
                    </LoadingContainer>
                  )}
                  {atendimentos.map(atendimento => (
                    <Atendimento key={atendimento.protocolo}>
                      <ContainerDetails>
                        <button
                          ref={btnActionDropRef}
                          className="atendDetails"
                          type="button"
                          title="Detalhes"
                          onClick={() =>
                            handleDetailsButton(atendimento.protocolo)
                          }
                        >
                          <BiDetail />
                        </button>
                        {visible &&
                          currentAtendimento === atendimento.protocolo && (
                            <DropDetails position={positionContent}>
                              {atendimento.observacao}
                            </DropDetails>
                          )}
                      </ContainerDetails>
                      <header>
                        <img
                          src={
                            icons[atendimento.idmotivots]
                              ? icons[atendimento.idmotivots]
                              : icons.outros
                          }
                          alt="icon-atend-logo"
                        />
                      </header>
                      <aside>
                        <h5>{atendimento.descricao}</h5>
                        <p>{atendimento.nomeusuario}</p>
                        <small>{atendimento.dateFormatted}</small>
                      </aside>
                    </Atendimento>
                  ))}
                </AtendimentoContainer>
              </SectionRight>
            </BoardDetails>
          )}
        </Main>
      </Content>
    </Container>
  );
};

export default OccurrenceDetails;
