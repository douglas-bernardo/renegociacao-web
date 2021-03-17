/* eslint-disable react/jsx-curly-newline */
/* eslint-disable no-nested-ternary */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import format from 'date-fns/format';
import { parseISO } from 'date-fns';

import { BiDetail } from 'react-icons/bi';

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
  SectionRight,
  Card,
  CardHeader,
  CardBody,
  LoadingContainder,
  AtendimentoContainer,
  Atendimento,
  ContainerDetails,
  DropDetails,
} from './styles';

import negociacaoLogo from '../../assets/money-talk.svg';
import whatsappLogo from '../../assets/whatsapp.svg';
import infoLogo from '../../assets/info.svg';
import cobrancaLogo from '../../assets/price-tag.svg';
import alertaLogo from '../../assets/warning.svg';
import outrosAtLogo from '../../assets/speak.svg';

import Tag from '../../components/Tag';
import { api, apiTimesharing } from '../../services/api';
import Loading from '../../components/Loading';
import { numberFormat } from '../../utils/numberFormat';

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

const OcorrenciaDetalhes: React.FC = () => {
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
  }, [params.id]);

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

  return (
    <Container>
      <Sidebar />
      <Content>
        <Header />
        <Main>
          {isError && !ocorrencia && <Whoops errorCode={errorCode} />}
          {ocorrencia && (
            <BoardDetails>
              <SectionLeft>
                <header>
                  <div>
                    <Link to="/ocorrencias">Voltar</Link>
                  </div>
                  <Tag
                    className="tagSituacao"
                    theme={situacaoStyle[ocorrencia.situacao.id] || 'default'}
                  >
                    {ocorrencia.situacao.nome}
                  </Tag>
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
