/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import format from 'date-fns/format';
import { parseISO } from 'date-fns';
import Select from 'react-select';
import { OptionsType, OptionTypeBase } from 'react-select';

import { BiDetail } from 'react-icons/bi';
import { FaClipboardCheck, FaTimesCircle, FaUndo } from 'react-icons/fa';

import { Link } from 'react-router-dom';
import { Container, Content } from '../../components/Container';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Whoops from '../../components/Whoops';

import { OutSideClick } from '../../hooks/outSideClick';

import {
  Main,
  BoardDetails,
  SectionLeft,
  ActionsGroup,
  SectionRight,
  Card,
  CardHeader,
  CardBody,
  LoadingContainder,
  AtendimentoContainer,
  Atendimento,
  ContainerDetails,
  DropDetails,
  ActionGroupOthers,
} from './styles';

import negociacaoLogo from '../../assets/money-talk.svg';
import whatsappLogo from '../../assets/whatsapp.svg';
import infoLogo from '../../assets/info.svg';
import cobrancaLogo from '../../assets/price-tag.svg';
import alertaLogo from '../../assets/warning.svg';
import outrosAtLogo from '../../assets/speak.svg';

import Tag from '../../components/Tag';
import { api, apiTimesharing } from '../../services/api';
import ModalRetencao from '../../components/ModalRetencao';
import ModalReversao from '../../components/ModalReversao';
import ModalCancelamento from '../../components/ModalCancelamento';
import Loading from '../../components/Loading';
import { numberFormat } from '../../utils/numberFormat';

import { useToast } from '../../hooks/toast';
import ModalOutros from '../../components/ModalOutros';

interface Situacao {
  id: number;
  nome: string;
}

interface Ocorrencia {
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
  produto: string;
  status: string;
  motivo: string;
  nomeusuario_resp: string;
  nomeusuario_cadastro: string;
  departamento: string;
  situacao: {
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

interface OcorrenciaParams {
  id: string;
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

const situacaoStyle = {
  '1': 'warning',
  '6': 'success',
  '7': 'info',
};

const statusTimesharingTypes = {
  C: 'Canceldo',
  F: 'Finalizado',
  P: 'Pendente',
};

interface IRetencaoDTO {
  origem_id: number;
  tipo_solicitacao_id: number;
  tipo_contato_id: number;
  motivo_id: number;
  valor_primeira_parcela: number;
  observacao: string;
  valor_financiado: number;
}

interface IReversaoDTO {
  origem_id: number;
  tipo_solicitacao_id: number;
  tipo_contato_id: number;
  motivo_id: number;
  valor_financiado: number;
  reembolso: number;
  numero_pc: number;
  taxas_extras: number;
  valor_primeira_parcela: number;
  projeto_id: number;
  numerocontrato: number;
  valor_venda: number;
  observacao: string;
}

interface ICancelamentoDTO {
  origem_id: number;
  tipo_solicitacao_id: number;
  tipo_contato_id: number;
  motivo_id: number;
  valor_financiado: number;
  reembolso: number;
  numero_pc: number;
  taxas_extras: number;
  observacao: string;
  multa: string;
}

interface IOutrosDTO {
  situacao_id: number;
  origem_id: number;
  tipo_solicitacao_id: number;
  tipo_contato_id: number;
  motivo_id: number;
  observacao: string;
}

const selectCustomStyles = {
  container: base => ({
    ...base,
    flex: 1,
  }),
};

const OcorrenciaDetalhes: React.FC = () => {
  const [situacaoOptions, setSituacaoOptions] = useState<Situacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorCode, setErrorCode] = useState(0);
  const params = useParams<OcorrenciaParams>();
  const [ocorrencia, setOcorrencia] = useState<Ocorrencia>();
  const [idPessoaCliente, setIdPessoaCliente] = useState<number | null>(null);
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);

  const { visible, setVisible, ref } = OutSideClick(false);
  const [currentAtendimento, setCurrentAtendimento] = useState('');
  const btnActionDropRef = useRef<HTMLButtonElement>(null);
  const [positionContent, setPositionContent] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalReversaoOpen, setModalReversaoOpen] = useState(false);
  const [modalCancelamentoOpen, setModalCancelamentoOpen] = useState(false);
  const [modalOutrosOpen, setModalOutrosOpen] = useState(false);
  const [optionModalOutrosSelected, setOptionModalOutrosSelected] = useState<
    OptionsType<OptionTypeBase>
  >({} as OptionsType<OptionTypeBase>);
  const { addToast } = useToast();

  const [refreshPageData, setRefreshPageData] = useState(false);

  useEffect(() => {
    api
      .get(`ocorrencias/${params.id}`)
      .then(response => {
        const { data } = response.data;
        const ocorrenciaFormatted: Ocorrencia = {
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
      .get(`atendimentos/${idPessoaCliente}`)
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

  useEffect(() => {
    api
      .get(`/dominio/situacao`)
      .then(response => {
        const { data } = response.data;

        const options = data.map((opt: Situacao) => {
          return { value: opt.id, label: opt.nome };
        });
        setSituacaoOptions(options);
      })
      .catch((error: Error) => {
        setIsLoading(false);
        setIsError(true);
        console.log(error.message);
      });
  }, []);

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

  const toggleRetencaoModal = useCallback(() => {
    setModalOpen(!modalOpen);
  }, [modalOpen]);

  const handleRetencao = useCallback(
    async (data: IRetencaoDTO) => {
      try {
        const retencao = {
          situacao: {
            situacao_id: 6,
          },
          negociacao: {
            origem_id: data.origem_id,
            tipo_solicitacao_id: data.tipo_solicitacao_id,
            tipo_contato_id: data.tipo_contato_id,
            motivo_id: data.motivo_id,
            valor_primeira_parcela: data.valor_primeira_parcela,
            observacao: data.observacao,
          },
          reversao: {
            valor_financiado: data.valor_financiado,
          },
        };

        await api.post(`/ocorrencias/${params.id}/finaliza-retencao`, retencao);
        setRefreshPageData(true);
        addToast({
          type: 'success',
          title: 'Ocorrência Finalizada!',
          description: 'Retenção de Contrato',
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro na solicitação',
        });
      }
    },
    [addToast, params.id],
  );

  const toggleReversaoModal = useCallback(() => {
    setModalReversaoOpen(!modalReversaoOpen);
  }, [modalReversaoOpen]);

  const handleReversao = useCallback(
    async (data: IReversaoDTO) => {
      try {
        const reversao = {
          situacao: {
            situacao_id: 7,
          },
          negociacao: {
            origem_id: data.origem_id,
            tipo_solicitacao_id: data.tipo_solicitacao_id,
            tipo_contato_id: data.tipo_contato_id,
            motivo_id: data.motivo_id,
            reembolso: data.reembolso,
            numero_pc: data.numero_pc,
            taxas_extras: data.taxas_extras,
            valor_primeira_parcela: data.valor_primeira_parcela,
            observacao: data.observacao,
          },
          reversao: {
            projeto_id: data.projeto_id,
            numerocontrato: data.numerocontrato,
            valor_venda: data.valor_venda,
          },
        };
        await api.post(`/ocorrencias/${params.id}/finaliza-reversao`, reversao);
        setRefreshPageData(true);
        addToast({
          type: 'success',
          title: 'Ocorrência Finalizada!',
          description: 'Reversão de Contrato',
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro na solicitação',
        });
      }
    },
    [addToast, params.id],
  );

  const toggleCancelamentoModal = useCallback(() => {
    setModalCancelamentoOpen(!modalCancelamentoOpen);
  }, [modalCancelamentoOpen]);

  const handleCancelamento = useCallback(
    async (data: ICancelamentoDTO) => {
      try {
        const cancelamento = {
          situacao: {
            situacao_id: 2,
          },
          negociacao: {
            origem_id: data.origem_id,
            tipo_solicitacao_id: data.tipo_solicitacao_id,
            tipo_contato_id: data.tipo_contato_id,
            motivo_id: data.motivo_id,
            reembolso: data.reembolso,
            numero_pc: data.numero_pc,
            taxas_extras: data.taxas_extras,
            observacao: data.observacao,
          },
          cancelamento: {
            multa: data.multa,
          },
        };
        await api.post(
          `/ocorrencias/${params.id}/finaliza-cancelamento`,
          cancelamento,
        );
        setRefreshPageData(true);
        addToast({
          type: 'success',
          title: 'Ocorrência Finalizada!',
          description: 'Cancelamento de Contrato',
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro na solicitação',
        });
      }
    },
    [addToast, params.id],
  );

  const toggleOutrosModal = useCallback(
    (selected: any) => {
      setOptionModalOutrosSelected(selected);
      setModalOutrosOpen(!modalOutrosOpen);
    },
    [modalOutrosOpen],
  );

  const toggleOutrosModalAbort = useCallback(() => {
    setModalOutrosOpen(!modalOutrosOpen);
  }, [modalOutrosOpen]);

  const handleOutros = useCallback(
    async (data: IOutrosDTO) => {
      try {
        const outros = {
          situacao: {
            situacao_id: data.situacao_id,
          },
          negociacao: {
            origem_id: data.origem_id,
            tipo_solicitacao_id: data.tipo_solicitacao_id,
            tipo_contato_id: data.tipo_contato_id,
            motivo_id: data.motivo_id,
            observacao: data.observacao,
          },
        };
        await api.post(`/ocorrencias/${params.id}/finaliza-padrao`, outros);
        setRefreshPageData(true);
        addToast({
          type: 'success',
          title: 'Ocorrência Finalizada!',
        });
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro na solicitação',
        });
      }
    },
    [addToast, params.id],
  );

  return (
    <Container>
      <ModalRetencao
        isOpen={modalOpen}
        setIsOpen={toggleRetencaoModal}
        handleRetencao={handleRetencao}
      />
      <ModalReversao
        isOpen={modalReversaoOpen}
        setIsOpen={toggleReversaoModal}
        handleReversao={handleReversao}
      />
      <ModalCancelamento
        isOpen={modalCancelamentoOpen}
        setIsOpen={toggleCancelamentoModal}
        handleCancelamento={handleCancelamento}
      />
      <ModalOutros
        isOpen={modalOutrosOpen}
        setIsOpen={toggleOutrosModalAbort}
        handleOutros={handleOutros}
        situacaoOptions={situacaoOptions}
        defaultSituacaoOption={optionModalOutrosSelected}
      />
      <Sidebar />
      <Content>
        <Header />
        <Main>
          {isError && !ocorrencia && <Whoops errorCode={errorCode} />}
          {ocorrencia && (
            <BoardDetails>
              <SectionLeft>
                <header>
                  <div style={{ marginBottom: '10px' }}>
                    <Link to="/ocorrencias">Voltar</Link>
                  </div>
                  <Tag
                    className="tagSituacao"
                    theme={situacaoStyle[ocorrencia.situacao.id] || 'default'}
                  >
                    {ocorrencia.situacao.nome}
                  </Tag>
                  {Number(ocorrencia.situacao.id) === 1 && (
                    <>
                      <ActionsGroup>
                        <strong>Finalizar como:</strong>
                        <button type="button" onClick={toggleRetencaoModal}>
                          <FaClipboardCheck className="drop" />
                          Retenção
                        </button>
                        <button type="button" onClick={toggleReversaoModal}>
                          <FaUndo className="drop rev" />
                          Reversão
                        </button>
                        <button type="button" onClick={toggleCancelamentoModal}>
                          <FaTimesCircle className="drop cancel" />
                          Cancelamento
                        </button>
                      </ActionsGroup>
                      <ActionGroupOthers>
                        <strong>Finalizar Outros:</strong>
                        <Select
                          options={situacaoOptions}
                          styles={selectCustomStyles}
                          placeholder="Situação"
                          onChange={toggleOutrosModal}
                          value={null}
                        />
                      </ActionGroupOthers>
                    </>
                  )}
                  <h1>Ocorrência | Detalhes</h1>
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
                        {`${ocorrencia.numeroprojeto}-${ocorrencia.numerocontrato}`}
                      </div>
                    </div>
                    <div className="row">
                      <span>Valor de Venda:</span>
                      <div>{ocorrencia.valorVendaFormatted}</div>
                    </div>
                    <div className="row">
                      <span>Produto:</span>
                      <div>{ocorrencia.produto}</div>
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
                    <LoadingContainder>
                      <Loading />
                      <h3>Carregando atendimentos...</h3>
                    </LoadingContainder>
                  )}
                  {isError && (
                    <LoadingContainder>
                      <Whoops errorCode={errorCode} />
                    </LoadingContainder>
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

export default OcorrenciaDetalhes;
