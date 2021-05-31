import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FaFilter, FaInfoCircle } from 'react-icons/fa';

import Select from 'react-select';
import * as Yup from 'yup';

import format from 'date-fns/format';
import { parseISO } from 'date-fns';

import ReactTooltip from 'react-tooltip';
import { Container, Content } from '../../components/Container';

import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Whoops from '../../components/Whoops';

import Pagination, { PaginationHandles } from '../../components/Pagination';

import { Main, MainHeader, FilterBar, OccurrenceTable } from './styles';

import { api } from '../../services/api';

import Loading from '../../components/Loading';
import ModalNegotiationRegister from '../../components/ModalNegotiationRegister';
import DropOccurrenceActions from '../../components/DropOccurrenceActions';

import InputDatePickerProps, {
  InputDatePickerHandles,
} from '../../components/InputDatePicker';

interface Occurrence {
  id: number;
  dtocorrencia: string;
  dateFormatted: string;
  numero_ocorrencia: number;
  nome_cliente: string;
  numeroprojeto: number;
  numerocontrato: number;
  status_ocorrencia: {
    id: number;
    nome: string;
  };
}

interface LocationProps {
  limit: number | undefined;
  offset: number | undefined;
  firstPageRangeDisplayed: number | undefined;
  currentPage: number | undefined;
  status: number | undefined;
}

const statusOccurrence = [
  { value: 0, label: 'Todas' },
  { value: 1, label: 'Em Aberto' },
  { value: 2, label: 'Em Negociação' },
  { value: 3, label: 'Negociação Encerrada' },
  { value: 4, label: 'Encerrada Sem Negociação' },
];

const selectCustomStyles = {
  container: base => ({
    ...base,
    // flex: 1,
    width: 250,
    marginLeft: 10,
  }),
  // control: () => ({
  //   width: 400,
  // }),
};

const Occurrences: React.FC = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const inputStartDateRef = useRef<InputDatePickerHandles>(null);
  const inputEndDateRef = useRef<InputDatePickerHandles>(null);
  const location = useLocation<LocationProps>();
  const history = useHistory();
  const paginationRef = useRef<PaginationHandles>(null);

  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [tableRefresh, setTableRefresh] = useState(false);
  const [totalOccurrences, setTotalOccurrences] = useState(0);
  const [selectedOccurrence, setSelectedOccurrence] = useState<number | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [dateError, setDateError] = useState<String | undefined>('');

  const [limit, setLimit] = useState(() => {
    if (location.state?.limit) {
      return location.state.limit;
    }
    return 10;
  });

  const [offset, setOffset] = useState(() => {
    if (location.state?.offset) {
      return location.state.offset;
    }
    return 0;
  });

  const [startDate, setStartDate] = useState(() => {
    return new Date(new Date().getFullYear(), 0, 1);
  });

  const [endDate, setEndDate] = useState(() => {
    return new Date();
  });

  const [status, setStatus] = useState(() => {
    if (location.state?.status) {
      return location.state.status;
    }
    return 0;
  });

  const handleSetCurrentPage = useCallback(() => {
    if (location.state?.currentPage) {
      paginationRef.current?.handleSetCurrentPage(location.state.currentPage);
    }

    if (location.state?.firstPageRangeDisplayed) {
      paginationRef.current?.handleSetFirstPageRangeDisplayed(
        location.state.firstPageRangeDisplayed,
      );
    }
  }, [location.state]);

  useEffect(() => {
    api
      .get(`/occurrences`, {
        params: {
          offset,
          limit,
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
          status,
        },
      })
      .then(response => {
        setTotalOccurrences(response.headers['x-total-count']);
        const { data } = response.data;
        const occurrenceFormatted = data.map((occurrence: Occurrence) => {
          return {
            ...occurrence,
            dateFormatted: format(
              parseISO(occurrence.dtocorrencia),
              'dd-MM-yyyy',
            ),
          };
        });
        setOccurrences(occurrenceFormatted);
        setIsLoading(false);
        handleSetCurrentPage();
      })
      .catch((error: Error) => {
        setIsLoading(false);
        setIsError(true);
        console.log(error.message);
      });
  }, [
    limit,
    offset,
    startDate,
    endDate,
    status,
    tableRefresh,
    handleSetCurrentPage,
  ]);

  const refreshPage = useCallback(() => {
    setTableRefresh(!tableRefresh);
    window.scrollTo(0, 0);
  }, [tableRefresh]);

  const handleOffsetAndLimit = useCallback(
    (_limit: number, _offset: number) => {
      setLimit(_limit);
      setOffset(_offset);
      if (location.state) {
        history.replace(location.pathname, null);
      }
    },
    [location, history],
  );

  const handleSearchBar = useCallback((e: FormEvent) => {
    e.preventDefault();
    if (
      !searchInputRef.current?.value ||
      searchInputRef.current?.value.length < 3
    ) {
      return;
    }
    api
      .get('/occurrences-search', {
        params: {
          param: searchInputRef.current?.value,
        },
      })
      .then(response => {
        const { data } = response.data;
        const occurrenceFormatted = data.map((occurrence: Occurrence) => {
          return {
            ...occurrence,
            dateFormatted: format(
              parseISO(occurrence.dtocorrencia),
              'dd-MM-yyyy',
            ),
          };
        });
        setOccurrences(occurrenceFormatted);
        setIsLoading(false);
        setTotalOccurrences(0);
      })
      .catch((error: Error) => {
        setIsLoading(false);
        setIsError(true);
        console.log(error.message);
      });
  }, []);

  const handleInputSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.value.length === 0) {
        refreshPage();
      }
    },
    [refreshPage],
  );

  const handleEndOccurrence = useCallback(
    async (occurrence_id: number) => {
      await api.post(`/occurrences/${occurrence_id}/close`);
      refreshPage();
    },
    [refreshPage],
  );

  const handleDatePicker = useCallback(() => {
    setDateError('');

    const dateFilterParams = {
      startDate: inputStartDateRef.current?.selectedDate,
      endDate: inputEndDateRef.current?.selectedDate,
    };

    const schema = Yup.object().shape({
      startDate: Yup.date().required('Data inicial não pode ser vazia'),
      endDate: Yup.date()
        .required('Data final não pode ser vazia')
        .min(
          Yup.ref('startDate'),
          'Data final não pode ser anterior a data inicial',
        ),
    });

    schema
      .validate(dateFilterParams, { abortEarly: false })
      .then(valid => {
        setStartDate(valid.startDate);
        setEndDate(valid.endDate);
        setOffset(0);
      })
      .catch(err => {
        err.inner.forEach(error => {
          if (error.path === 'startDate') {
            setDateError(error.message);
          }
          if (error.path === 'endDate') {
            setDateError(error.message);
          }
        });
      });
  }, []);

  const handleSelectStatusFilter = useCallback(
    value => {
      setStatus(value.value);
      setOffset(0);
      paginationRef.current?.handleSetCurrentPage(1);
      paginationRef.current?.handleSetFirstPageRangeDisplayed(0);
      if (location.state) {
        history.replace(location.pathname, null);
      }
    },
    [location, history],
  );

  return (
    <Container>
      <Sidebar />
      <ModalNegotiationRegister
        occurrence_id={Number(selectedOccurrence)}
        refreshPage={refreshPage}
      />
      <Content>
        <Header>
          <form onSubmit={handleSearchBar}>
            <input
              ref={searchInputRef}
              type="text"
              className="search-bar"
              placeholder="Pesquise por Ocorrência, Cliente ou Contrato"
              title="Tecle enter para pesquisar..."
              onChange={handleInputSearch}
            />
          </form>
        </Header>
        <Main>
          <MainHeader>
            <h1>Ocorrências</h1>
          </MainHeader>
          <FilterBar>
            <div className="dateFilter">
              <span>Data da ocorrência:</span>
              <div className="inputDates">
                <InputDatePickerProps
                  ref={inputStartDateRef}
                  name="start_date"
                  label="Início:"
                  defaultDate={startDate}
                />
                <InputDatePickerProps
                  ref={inputEndDateRef}
                  name="end_date"
                  label="Fim:"
                  defaultDate={endDate}
                />
                <button
                  className="dateFilterRange"
                  type="button"
                  onClick={handleDatePicker}
                  title="Filtrar"
                >
                  <FaFilter />
                  Filtrar
                </button>
              </div>
              {dateError && <span className="invalidDate">{dateError}</span>}
            </div>
            <Select
              onChange={handleSelectStatusFilter}
              options={statusOccurrence}
              placeholder="Status Ocorrência"
              defaultValue={
                location.state?.status ? statusOccurrence[status] : undefined
              }
              styles={selectCustomStyles}
            />
          </FilterBar>
          <OccurrenceTable>
            <thead>
              <tr>
                <th>Data</th>
                <th>Número</th>
                <th>Cliente</th>
                <th>Projeto-Contrato</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {occurrences.map(occurrence => (
                <tr
                  key={occurrence.id}
                  onClick={() => setSelectedOccurrence(occurrence.id)}
                >
                  <td>{occurrence.dateFormatted}</td>
                  <td>{occurrence.numero_ocorrencia}</td>
                  <td>{occurrence.nome_cliente}</td>
                  <td>
                    {occurrence.numeroprojeto ? (
                      `${occurrence.numeroprojeto}-${occurrence.numerocontrato}`
                    ) : (
                      <div className="occurrenceInfo">
                        <p>Não vinculada</p>
                        <span data-tip data-for="occurrenceInfo">
                          <FaInfoCircle />
                        </span>
                        <ReactTooltip id="occurrenceInfo" type="error">
                          <span>
                            Essa ocorrência não foi vinculada a nenhum contrato.
                            Verifique no Timesharing.
                          </span>
                        </ReactTooltip>
                      </div>
                    )}
                  </td>
                  <td
                    className={
                      Number(occurrence.status_ocorrencia.id) === 1
                        ? 'occurrence-opened'
                        : ''
                    }
                  >
                    {occurrence.status_ocorrencia.nome}
                  </td>
                  <td>
                    <DropOccurrenceActions
                      occurrenceProps={{
                        id: occurrence.id,
                        status_ocorrencia_id: occurrence.status_ocorrencia.id,
                        numeroprojeto: occurrence.numeroprojeto,
                      }}
                      limit={limit}
                      offset={offset}
                      firstPageRangeDisplayed={
                        paginationRef.current?.firstPageRangeDisplayed
                      }
                      currentPage={paginationRef.current?.currentPage}
                      status={status}
                      handleEndOccurrence={handleEndOccurrence}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </OccurrenceTable>
          {totalOccurrences > 0 && (
            <Pagination
              ref={paginationRef}
              count={totalOccurrences}
              limit={limit}
              pageRangeDisplayed={5}
              onChange={handleOffsetAndLimit}
            />
          )}
          {isLoading && <Loading />}
          {isError && <Whoops />}
        </Main>
      </Content>
    </Container>
  );
};

export default Occurrences;
