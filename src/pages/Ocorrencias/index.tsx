import React, { useCallback, useEffect, useState } from 'react';

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

import {
  Main,
  MainHeader,
  OcorrenciasTable,
  StatusSituacao,
  PaginationBar,
  Pagination,
  Page,
} from './styles';
import api from '../../services/api';

interface Ocorrencia {
  id: number;
  numero_ocorrencia: number;
  nome_cliente: string;
  numeroprojeto: number;
  numerocontrato: number;
  situacao: {
    id: number;
    nome: string;
  };
}

const Ocorrencias: React.FC = () => {
  const situacao = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];

  const situacaoStyle = {
    '1': 'warning',
    '6': 'success',
    '7': 'info',
  };

  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [limit, setLimit] = useState(10); // per page
  const [offset, setOffset] = useState(0); // increment com tot limit

  const [firstPageRangeDisplayed, setFirstPageRangeDisplayed] = useState(0);
  const [pageRangeDisplayed, setPageRangeDisplayed] = useState(3);
  const [pagesDisplayed, setPagesDisplayed] = useState<Array<Number>>([]);

  const [pages, setPages] = useState<Array<Number>>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    api
      .get(`/ocorrencias`, {
        params: {
          offset,
          limit,
        },
      })
      .then(response => {
        const total = Math.ceil(response.headers['x-total-count'] / limit);

        const arrayPages = new Array<Number>();
        for (let i = 1; i <= total; i += 1) {
          arrayPages.push(i);
        }
        setPages(arrayPages);
        setPagesDisplayed(
          arrayPages.slice(
            firstPageRangeDisplayed,
            firstPageRangeDisplayed + pageRangeDisplayed,
          ),
        );

        const { data } = response.data;
        setOcorrencias(data);
      });
  }, [limit, offset, pageRangeDisplayed, firstPageRangeDisplayed]);

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
    console.log(`offset ${(currentFirstPage - 1) * limit}`);
    setOffset((currentFirstPage - 1) * limit);
    setCurrentPage(currentFirstPage);
  }, [firstPageRangeDisplayed, pageRangeDisplayed, limit]);

  const handleNext = useCallback(() => {
    const iniRange = firstPageRangeDisplayed + pageRangeDisplayed;
    setFirstPageRangeDisplayed(iniRange);

    const currentFirstPage = iniRange + 1;
    console.log(`offset ${(currentFirstPage - 1) * limit}`);
    setOffset((currentFirstPage - 1) * limit);
    setCurrentPage(currentFirstPage);
  }, [firstPageRangeDisplayed, pageRangeDisplayed, limit]);

  const handleLastPage = useCallback(() => {
    const iniRange = pages.length - pageRangeDisplayed + 1;
    setFirstPageRangeDisplayed(iniRange);
    setOffset((pages.length - 1) * limit);
    setCurrentPage(pages.length);
  }, [pageRangeDisplayed, pages, limit]);

  return (
    <Container>
      <Sidebar />
      <Content>
        <Header>
          <input type="text" className="search-bar" placeholder="Pesquisar" />
        </Header>
        <Main>
          <MainHeader>
            <h1>Ocorrências</h1>
          </MainHeader>
          <OcorrenciasTable>
            <thead>
              <tr>
                <th>Número</th>
                <th>Cliente</th>
                <th>Projeto-Contrato</th>
                <th colSpan={2}>Situação</th>
              </tr>
            </thead>
            <tbody>
              {ocorrencias.map(ocorrencia => (
                <tr key={ocorrencia.id}>
                  <td>{ocorrencia.numero_ocorrencia}</td>
                  <td>{ocorrencia.nome_cliente}</td>
                  <td>
                    {`${ocorrencia.numeroprojeto}-${ocorrencia.numero_ocorrencia}`}
                  </td>
                  <td>
                    <StatusSituacao
                      theme={situacaoStyle[ocorrencia.situacao.id] || 'default'}
                    >
                      {ocorrencia.situacao.nome}
                    </StatusSituacao>
                  </td>
                  <td>
                    <DropAction situacao={situacao} />
                  </td>
                </tr>
              ))}
            </tbody>
          </OcorrenciasTable>

          <PaginationBar>
            <Pagination>
              {currentPage > pageRangeDisplayed && (
                <>
                  <button
                    className="controlNavPage"
                    type="button"
                    title="Primeira"
                    onClick={handleFirstPage}
                  >
                    <FaAngleDoubleLeft />
                  </button>
                  <button
                    className="controlNavPage"
                    type="button"
                    title="Anterior"
                    onClick={handlePrevious}
                  >
                    <FaAngleLeft />
                  </button>
                </>
              )}
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
              {!(
                pagesDisplayed[pagesDisplayed.length - 1] === pages.length ||
                currentPage === pages.length
              ) && (
                <>
                  <button
                    className="controlNavPage"
                    type="button"
                    title="Próxima"
                    onClick={handleNext}
                  >
                    <FaAngleRight />
                  </button>
                  <button
                    className="controlNavPage"
                    type="button"
                    title="Última"
                    onClick={handleLastPage}
                  >
                    <FaAngleDoubleRight />
                  </button>
                </>
              )}
            </Pagination>
          </PaginationBar>
        </Main>
      </Content>
    </Container>
  );
};

export default Ocorrencias;
