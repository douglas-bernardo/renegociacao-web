import React, { useCallback, useEffect, useState } from 'react';
import format from 'date-fns/format';
import { parseISO } from 'date-fns';

import { Container, Content } from '../../components/Container';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import DropAction from '../../components/DropAction';
import Whoops from '../../components/Whoops';

import Pagination from '../../components/Pagination';

import {
  Main,
  MainHeader,
  OcorrenciasTable,
  LoadingContainder,
} from './styles';

import { api } from '../../services/api';
import ModalRetencao from '../../components/ModalRetencao';
import Tag from '../../components/Tag';

import { useToast } from '../../hooks/toast';
import Loading from '../../components/Loading';

interface Situacao {
  id: number;
  nome: string;
}

interface Ocorrencia {
  id: number;
  dtocorrencia: string;
  dateFormatted: string;
  numero_ocorrencia: number;
  nome_cliente: string;
  numeroprojeto: number;
  numerocontrato: number;
  situacao: {
    id: number;
    nome: string;
  };
}

interface IRetencaoDTO {
  origem_id: number;
  tipo_solicitacao_id: number;
  tipo_contato_id: number;
  motivo_id: number;
  valor_primeira_parcela: number;
  observacao: string;
  valor_financiado: number;
}

const Ocorrencias: React.FC = () => {
  const { addToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [situacaoOptions, setSituacaoOptions] = useState<Situacao[]>([]);
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [tableRefresh, setTableRefresh] = useState(false);
  const [totalOcorrencias, setTotalOcorrencias] = useState(0);
  const [selectedOcorrencia, setSelectedOcorrencia] = useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const situacaoStyle = {
    '1': 'warning',
    '6': 'success',
    '7': 'info',
  };

  useEffect(() => {
    api
      .get(`/dominio/situacao`)
      .then(response => {
        const { data } = response.data;

        const options = data.map(opt => {
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

  useEffect(() => {
    api
      .get(`/ocorrencias`, {
        params: {
          offset,
          limit,
        },
      })
      .then(response => {
        setTotalOcorrencias(response.headers['x-total-count']);

        const { data } = response.data;
        const ocorrenciaFormatted = data.map((ocorr: Ocorrencia) => {
          return {
            ...ocorr,
            dateFormatted: format(parseISO(ocorr.dtocorrencia), 'dd-MM-yyyy'),
          };
        });
        setOcorrencias(ocorrenciaFormatted);
        setIsLoading(false);
      })
      .catch((error: Error) => {
        setIsLoading(false);
        setIsError(true);
        console.log(error.message);
      });
  }, [limit, offset, tableRefresh]);

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

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
          retencao: {
            valor_financiado: data.valor_financiado,
          },
        };

        await api.post(
          `/ocorrencias/${selectedOcorrencia}/finaliza-retencao`,
          retencao,
        );
        setTableRefresh(true);
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
    [addToast, selectedOcorrencia],
  );

  const handleOffsetAndLimit = useCallback(
    (_limit: number, _offset: number) => {
      setLimit(_limit);
      setOffset(_offset);
    },
    [],
  );

  return (
    <Container>
      <Sidebar />
      <Content>
        <Header>
          <input type="text" className="search-bar" placeholder="Pesquisar" />
        </Header>
        <Main>
          {isError ? (
            <Whoops />
          ) : (
            <>
              <MainHeader>
                <h1>Ocorrências</h1>
              </MainHeader>
              <ModalRetencao
                isOpen={modalOpen}
                setIsOpen={toggleModal}
                handleRetencao={handleRetencao}
              />
              {isLoading ? (
                <LoadingContainder>
                  <Loading />
                </LoadingContainder>
              ) : (
                <>
                  <OcorrenciasTable>
                    <thead>
                      <tr>
                        <th>Data</th>
                        <th>Número</th>
                        <th>Cliente</th>
                        <th>Projeto-Contrato</th>
                        <th colSpan={2}>Situação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ocorrencias.map(ocorrencia => (
                        <tr
                          key={ocorrencia.id}
                          onClick={() => setSelectedOcorrencia(ocorrencia.id)}
                        >
                          <td>{ocorrencia.dateFormatted}</td>
                          <td>{ocorrencia.numero_ocorrencia}</td>
                          <td>{ocorrencia.nome_cliente}</td>
                          <td>
                            {`${ocorrencia.numeroprojeto}-${ocorrencia.numero_ocorrencia}`}
                          </td>
                          <td>
                            <Tag
                              theme={
                                situacaoStyle[ocorrencia.situacao.id] ||
                                'default'
                              }
                            >
                              {ocorrencia.situacao.nome}
                            </Tag>
                          </td>
                          <td>
                            <DropAction
                              openModal={toggleModal}
                              situacao={situacaoOptions}
                              ocorrenciaProps={{
                                id: ocorrencia.id,
                                finalizada:
                                  Number(ocorrencia.situacao.id) === 1,
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </OcorrenciasTable>
                  {totalOcorrencias > 0 && (
                    <Pagination
                      count={totalOcorrencias}
                      limit={limit}
                      pageRangeDisplayed={5}
                      onChange={handleOffsetAndLimit}
                    />
                  )}
                </>
              )}
            </>
          )}
        </Main>
      </Content>
    </Container>
  );
};

export default Ocorrencias;
