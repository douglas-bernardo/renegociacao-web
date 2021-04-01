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

import Loading from '../../components/Loading';
import ModalReversao from '../../components/ModalReversao';
import ModalCancelamento from '../../components/ModalCancelamento';
import ModalOutros from '../../components/ModalOutros';

const situacaoStyle = {
  '1': 'warning',
  '6': 'success',
  '7': 'info',
};

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

const Ocorrencias: React.FC = () => {
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

  const refreshPage = useCallback(() => {
    setTableRefresh(!tableRefresh);
    window.scrollTo(0, 0);
  }, [tableRefresh]);

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
      <ModalRetencao
        ocorrencia_id={String(selectedOcorrencia)}
        refreshPage={refreshPage}
      />
      <ModalReversao
        ocorrencia_id={String(selectedOcorrencia)}
        refreshPage={refreshPage}
      />
      <ModalCancelamento
        ocorrencia_id={String(selectedOcorrencia)}
        refreshPage={refreshPage}
      />
      <ModalOutros
        ocorrencia_id={String(selectedOcorrencia)}
        refreshPage={refreshPage}
        situacaoOptions={situacaoOptions}
      />
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
                            {`${ocorrencia.numeroprojeto}-${ocorrencia.numerocontrato}`}
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
                              ocorrenciaProps={{
                                id: ocorrencia.id,
                                finalizada:
                                  Number(ocorrencia.situacao.id) === 1,
                              }}
                              situacaoOptions={situacaoOptions}
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
