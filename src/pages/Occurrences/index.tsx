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
import { HiOutlineRefresh } from 'react-icons/hi';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';

import Select from 'react-select';
import * as Yup from 'yup';

import format from 'date-fns/format';
import { parseISO } from 'date-fns';

import ReactTooltip from 'react-tooltip';
import { Container, Content, MainHeader } from '../../components/Container';

import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Whoops from '../../components/Whoops';

import Pagination, { PaginationHandles } from '../../components/Pagination';

import { Main, FilterBar, OccurrenceTable } from './styles';

import { api } from '../../services/api';

import Loading from '../../components/Loading';
import ModalNegotiationRegister from '../../components/ModalNegotiationRegister';
import DropOccurrenceActions from '../../components/DropOccurrenceActions';

import InputDatePickerProps, {
  InputDatePickerHandles,
} from '../../components/InputDatePicker';
import { useToast } from '../../hooks/toast';
import ModalConfirm from '../../components/ModalConfirm';
import LoadingModal from '../../components/LoadingModal';

interface Options {
  value: string;
  label: string;
}

interface LocationProps {
  limit: number | undefined;
  offset: number | undefined;
  firstPageRangeDisplayed: number | undefined;
  currentPage: number | undefined;
  statusFilterSelected: Options[] | undefined;
}

interface StatusOccurrence {
  id: number;
  nome: string;
}

interface Occurrence {
  id: number;
  dtocorrencia: string;
  dateFormatted: string;
  numero_ocorrencia: number;
  nome_cliente: string;
  numeroprojeto: number;
  numerocontrato: number;
  valor_venda: number;
  valor_venda_formatted: string;
  nomeusuario_resp: string;
  status_ocorrencia: {
    id: number;
    nome: string;
  };
}

const selectCustomStyles = {
  container: base => ({
    ...base,
    width: 250,
    marginLeft: 10,
  }),
};

const Occurrences: React.FC = () => {
  /** Page Behavior */
  const { addToast } = useToast();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const inputStartDateRef = useRef<InputDatePickerHandles>(null);
  const inputEndDateRef = useRef<InputDatePickerHandles>(null);
  const location = useLocation<LocationProps>();
  const history = useHistory();
  const paginationRef = useRef<PaginationHandles>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [dateError, setDateError] = useState<String | undefined>('');
  const [tableRefresh, setTableRefresh] = useState(false);
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [occurrenceStatusOptions, setOccurrenceStatusOptions] = useState<
    Options[]
  >([]);

  /** Modal states and options */
  const [showLoadingModal, setLoadingModal] = useState(false);

  /** Domain */
  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [totalOccurrences, setTotalOccurrences] = useState(0);
  const [
    selectedOccurrence,
    setSelectedOccurrence,
  ] = useState<Occurrence | null>(null);

  /** Query Params States */
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

  const [statusFilterSelected, setStatusFilterSelected] = useState<Options[]>(
    () => {
      if (location.state?.statusFilterSelected) {
        return location.state.statusFilterSelected;
      }
      return [];
    },
  );

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

  /** Api Requests */
  useEffect(() => {
    const statusSelected = statusFilterSelected.map(item => {
      return item.value;
    });
    const ids = statusSelected.join().length > 0 ? statusSelected.join() : 0;

    api
      .get(`/occurrences`, {
        params: {
          offset,
          limit,
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
          status: ids,
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
        setBtnLoading(false);
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
    statusFilterSelected,
    tableRefresh,
    handleSetCurrentPage,
  ]);

  useEffect(() => {
    api
      .get('/domain/status-occurrence')
      .then(response => {
        const { data } = response.data;

        setOccurrenceStatusOptions(
          data.map((opt: StatusOccurrence) => {
            return { value: opt.id, label: opt.nome };
          }),
        );
      })
      .catch((error: Error) => {
        setIsLoading(false);
        setIsError(true);
        console.log(error.message);
      });
  }, []);

  /** Handles */
  const handleRefreshPage = useCallback(() => {
    setTableRefresh(!tableRefresh);
    window.scrollTo(0, 0);
  }, [tableRefresh]);

  const handleOffsetAndLimit = useCallback(
    (_limit: number, _offset: number) => {
      setIsLoading(true);

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
      .get('/occurrences/search', {
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
      });
  }, []);

  const handleInputSearch = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.value.length === 0) {
        handleRefreshPage();
      }
    },
    [handleRefreshPage],
  );

  const handleCloseOccurrenceWithoutNegotiation = useCallback(
    (occurrence_id: number) => {
      setLoadingModal(true);
      api
        .put(`/occurrences/${occurrence_id}`)
        .then(() => {
          handleRefreshPage();
          setLoadingModal(false);
        })
        .catch(error => {
          addToast({
            type: 'error',
            title: 'Não Permitido',
            description: error.response.data.message
              ? error.response.data.message
              : 'Erro na solicitação',
          });
        });
    },
    [handleRefreshPage, addToast],
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
    (selected: any) => {
      setIsLoading(true);

      setStatusFilterSelected(selected);
      setOffset(0);

      paginationRef.current?.handleSetCurrentPage(1);
      paginationRef.current?.handleSetFirstPageRangeDisplayed(0);
      if (location.state) {
        history.replace(location.pathname, null);
      }
    },
    [location, history],
  );

  const toggleModalConfirm = useCallback(() => {
    setShowModalConfirm(!showModalConfirm);
  }, [showModalConfirm]);

  const handleModalConfirmYes = useCallback(() => {
    toggleModalConfirm();
    if (selectedOccurrence) {
      handleCloseOccurrenceWithoutNegotiation(selectedOccurrence?.id);
    }
  }, [
    toggleModalConfirm,
    handleCloseOccurrenceWithoutNegotiation,
    selectedOccurrence,
  ]);

  const handleButtonRefreshPage = useCallback(() => {
    setIsLoading(true);
    setBtnLoading(true);
    handleRefreshPage();
  }, [handleRefreshPage]);

  return (
    <Container>
      <Sidebar />
      <LoadingModal isOpen={showLoadingModal} />
      {selectedOccurrence && (
        <ModalNegotiationRegister
          occurrence_id={selectedOccurrence?.id}
          refreshPage={handleRefreshPage}
        />
      )}
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
            <button
              className="refreshPage"
              type="button"
              onClick={handleButtonRefreshPage}
            >
              {btnLoading ? (
                <Loader type="Oval" color="#003379" height={20} width={20} />
              ) : (
                <HiOutlineRefresh size={20} />
              )}
              Atualizar
            </button>
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
              isMulti
              options={occurrenceStatusOptions}
              placeholder="Status Ocorrência"
              defaultValue={
                location.state?.statusFilterSelected
                  ? location.state.statusFilterSelected
                  : undefined
              }
              styles={selectCustomStyles}
            />
          </FilterBar>
          {isLoading ? (
            <Loading />
          ) : (
            <OccurrenceTable>
              <thead>
                <tr>
                  <th>Data da Ocorrência</th>
                  <th>Número</th>
                  <th>Responsável</th>
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
                    onClick={() => setSelectedOccurrence(occurrence)}
                  >
                    <td>{occurrence.dateFormatted}</td>
                    <td>{occurrence.numero_ocorrencia}</td>
                    <td>{occurrence.nomeusuario_resp}</td>
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
                          <ReactTooltip
                            id="occurrenceInfo"
                            type="error"
                            effect="solid"
                            delayShow={1000}
                          >
                            <span>
                              Essa ocorrência não foi vinculada a nenhum
                              contrato. Verifique no Timesharing.
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
                        statusFilterSelected={statusFilterSelected}
                        toggleModalConfirm={toggleModalConfirm}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </OccurrenceTable>
          )}
          {totalOccurrences > 0 && (
            <Pagination
              ref={paginationRef}
              count={totalOccurrences}
              limit={limit}
              pageRangeDisplayed={5}
              onChange={handleOffsetAndLimit}
            />
          )}
          {isError && <Whoops />}
        </Main>
      </Content>
    </Container>
  );
};

export default Occurrences;
