/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from 'react';
import Select from 'react-select';
import format from 'date-fns/format';
import { parseISO } from 'date-fns';

import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight,
} from 'react-icons/fa';
import { Container, Content } from '../../components/Container';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import DropAction from '../../components/DropAction';
import Whoops from '../../components/Whoops';

import {
  Main,
  MainHeader,
  OcorrenciasTable,
  PaginationBar,
  Pagination,
  Page,
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

  const [firstPageRangeDisplayed, setFirstPageRangeDisplayed] = useState(0);
  const [pageRangeDisplayed, setPageRangeDisplayed] = useState(3);
  const [pagesDisplayed, setPagesDisplayed] = useState<Array<Number>>([]);
  const [pages, setPages] = useState<Array<Number>>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const pageLimitToShow = [
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
  ];

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

        const totalPages = Math.ceil(response.headers['x-total-count'] / limit);

        const arrayPages = Array.from({ length: totalPages }, (_, i) => i + 1);
        setPages(arrayPages);

        setPagesDisplayed(
          arrayPages.slice(
            firstPageRangeDisplayed,
            firstPageRangeDisplayed + pageRangeDisplayed,
          ),
        );

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
  }, [
    limit,
    offset,
    pageRangeDisplayed,
    firstPageRangeDisplayed,
    tableRefresh,
  ]);

  const handleSelectPageLimitToShow = useCallback(value => {
    setLimit(value.value);
  }, []);

  const handleGotoPage = useCallback(
    page => {
      setOffset((page - 1) * limit);
      setCurrentPage(page);
    },
    [limit],
  );

  const handleFirstPage = useCallback(() => {
    setFirstPageRangeDisplayed(0);
    setOffset(0);
    setCurrentPage(1);
  }, []);

  const handlePrevious = useCallback(() => {
    const iniRange = firstPageRangeDisplayed - pageRangeDisplayed;
    setFirstPageRangeDisplayed(iniRange);

    const currentFirstPage = iniRange + 1;

    setOffset((currentFirstPage - 1) * limit);
    setCurrentPage(currentFirstPage);
  }, [firstPageRangeDisplayed, pageRangeDisplayed, limit]);

  const handleNext = useCallback(() => {
    const iniRange = firstPageRangeDisplayed + pageRangeDisplayed;
    setFirstPageRangeDisplayed(iniRange);

    const currentFirstPage = iniRange + 1;

    setOffset((currentFirstPage - 1) * limit);
    setCurrentPage(currentFirstPage);
  }, [firstPageRangeDisplayed, pageRangeDisplayed, limit]);

  const handleLastPage = useCallback(() => {
    const iniRange = pages.length - pageRangeDisplayed + 1;
    setFirstPageRangeDisplayed(iniRange);
    setOffset((pages.length - 1) * limit);
    setCurrentPage(pages.length);
  }, [pageRangeDisplayed, pages, limit]);

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

                  <PaginationBar>
                    <div className="pageLimitToShow">
                      <span>Mostrar</span>
                      <div className="pageLimitToShowControl">
                        <Select
                          onChange={handleSelectPageLimitToShow}
                          menuPlacement="auto"
                          options={pageLimitToShow}
                          defaultValue={pageLimitToShow[0]}
                        />
                      </div>
                      <span>
                        de
                        {` ${totalOcorrencias} `}
                        ocorrências
                      </span>
                    </div>
                    <Pagination>
                      <button
                        disabled={!(currentPage > 1)}
                        className="controlNavPage"
                        type="button"
                        title="Primeira"
                        onClick={handleFirstPage}
                      >
                        <FaAngleDoubleLeft />
                      </button>
                      <button
                        disabled={!(currentPage > pageRangeDisplayed)}
                        className="controlNavPage"
                        type="button"
                        title="Anterior"
                        onClick={handlePrevious}
                      >
                        <FaAngleLeft />
                      </button>
                      {pagesDisplayed.map(page => (
                        <Page
                          isSelected={page === currentPage}
                          key={page.toString()}
                          type="button"
                          onClick={() => handleGotoPage(page)}
                        >
                          {page}
                        </Page>
                      ))}
                      <button
                        disabled={
                          pagesDisplayed[pagesDisplayed.length - 1] ===
                            pages.length || currentPage === pages.length
                        }
                        className="controlNavPage"
                        type="button"
                        title="Próxima"
                        onClick={handleNext}
                      >
                        <FaAngleRight />
                      </button>
                      <button
                        disabled={
                          pagesDisplayed[pagesDisplayed.length - 1] ===
                            pages.length || currentPage === pages.length
                        }
                        className="controlNavPage"
                        type="button"
                        title="Última"
                        onClick={handleLastPage}
                      >
                        <FaAngleDoubleRight />
                      </button>
                    </Pagination>
                  </PaginationBar>
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
