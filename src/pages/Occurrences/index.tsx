import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FaInfoCircle } from 'react-icons/fa';
import { HiOutlineRefresh } from 'react-icons/hi';
import { RiFilterOffFill } from 'react-icons/ri';
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
import Loading from '../../components/Loading';
import ModalNegotiationRegister from '../../components/ModalNegotiationRegister';
import DropOccurrenceActions from '../../components/DropOccurrenceActions';
import InputDatePicker, {
  InputDatePickerHandles,
} from '../../components/InputDatePicker';
import ModalConfirm from '../../components/ModalConfirm';
import Can from '../../components/Can';

import { api } from '../../services/api';
import { Main, FilterBar, OccurrenceTable } from './styles';
import { useToast } from '../../hooks/toast';
import { numberFormat } from '../../utils/numberFormat';
import { getValidationErrors } from '../../utils/getValidationErrors';

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
  userRespFilterSelected: Options | undefined;
}

interface StatusOccurrence {
  id: number;
  nome: string;
}

interface Role {
  id: number;
  name: string;
}

interface User {
  ativo: boolean;
  email: string;
  id: number;
  nome: string;
  primeiro_nome: string;
  ts_usuario_id: number;
  roles: Role[];
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
    minWidth: 200,
    marginLeft: 10,
  }),
};

const Occurrences: React.FC = () => {
  const { addToast } = useToast();

  const searchInputRef = useRef<HTMLInputElement>(null);
  const inputStartDateRef = useRef<InputDatePickerHandles>(null);
  const inputEndDateRef = useRef<InputDatePickerHandles>(null);
  const location = useLocation<LocationProps>();
  const history = useHistory();
  const paginationRef = useRef<PaginationHandles>(null);

  const [showModalConfirm, setShowModalConfirm] = useState(false);

  const [
    occurrenceStatusFilterOptions,
    setOccurrenceStatusFilterOptions,
  ] = useState<Options[]>([]);
  const [userRespFilterOptions, setUserFilterRespOptions] = useState<Options[]>(
    [],
  );

  const [occurrences, setOccurrences] = useState<Occurrence[]>([]);
  const [tableRefresh, setTableRefresh] = useState(false);
  const [totalOccurrences, setTotalOccurrences] = useState(0);
  const [
    selectedOccurrence,
    setSelectedOccurrence,
  ] = useState<Occurrence | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [isError, setIsError] = useState(false);

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

  const [isDateFiltered, setIsDateFiltered] = useState(false);
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

  const [userRespFilterSelected, setUserRespFilterSelected] = useState<
    Options | undefined
  >(() => {
    if (location.state?.userRespFilterSelected) {
      return location.state.userRespFilterSelected;
    }
    return undefined;
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
          userResp: userRespFilterSelected?.value,
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
            valor_venda_formatted: numberFormat(occurrence.valor_venda),
          };
        });
        setOccurrences(occurrenceFormatted);
        setIsLoading(false);
        setBtnLoading(false);
        handleSetCurrentPage();
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  }, [
    limit,
    offset,
    startDate,
    endDate,
    statusFilterSelected,
    userRespFilterSelected?.value,
    tableRefresh,
    handleSetCurrentPage,
  ]);

  useEffect(() => {
    Promise.all([api.get('/domain/status-occurrence'), api.get('/users')])
      .then(response => {
        const [statusOccurrence, users] = response;

        const { data: statusOccurrenceResponse } = statusOccurrence.data;
        setOccurrenceStatusFilterOptions(
          statusOccurrenceResponse.map((opt: StatusOccurrence) => {
            return { value: opt.id, label: opt.nome };
          }),
        );

        const { data: usersResponse } = users.data;
        const usersFilterOptions = usersResponse
          .filter((opt: User) => {
            return (
              opt.roles &&
              opt.roles.every(role => {
                return role.name === 'ROLE_CONSULTOR';
              })
            );
          })
          .map((opt: User) => {
            return { value: opt.ts_usuario_id, label: opt.primeiro_nome };
          })
          .sort((a: Options, b: Options) => {
            return a.label.localeCompare(b.label);
          });
        setUserFilterRespOptions([
          { value: '0', label: 'Todos' },
          ...usersFilterOptions,
        ]);
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
      });
  }, []);

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
      })
      .catch(() => {
        setIsLoading(false);
        setIsError(true);
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
      api
        .put(`/occurrences/${occurrence_id}`)
        .then(() => {
          handleRefreshPage();
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

  const handleStartDatePicker = useCallback(
    (date: Date) => {
      inputStartDateRef.current?.setError('');

      const dateFilterParams = {
        startDate: date,
        endDate,
      };

      const schema = Yup.object().shape({
        startDate: Yup.date()
          .required('Data inicial não pode ser vazia')
          .max(
            Yup.ref('endDate'),
            'Data inicial não pode ser posterior a data final',
          ),
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
          setIsLoading(true);
          setOffset(0);
          setIsDateFiltered(true);
        })
        .catch(err => {
          if (err instanceof Yup.ValidationError) {
            const errors = getValidationErrors(err);
            inputStartDateRef.current?.setError(errors.startDate);
          }
        });
    },
    [endDate],
  );

  const handleEndDatePicker = useCallback(
    (date: Date) => {
      inputEndDateRef.current?.setError('');

      const dateFilterParams = {
        startDate,
        endDate: date,
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
          setIsLoading(true);
          setOffset(0);
          setIsDateFiltered(true);
        })
        .catch(err => {
          if (err instanceof Yup.ValidationError) {
            const errors = getValidationErrors(err);
            inputEndDateRef.current?.setError(errors.endDate);
          }
        });
    },
    [startDate],
  );

  const handleClearDateFilter = useCallback(() => {
    setStartDate(new Date(new Date().getFullYear(), 0, 1));
    setEndDate(new Date());
    setIsLoading(true);
    setIsDateFiltered(false);
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

  const handleUserRespFilter = useCallback(
    (selected: any) => {
      setIsLoading(true);

      setUserRespFilterSelected(selected);
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
                <InputDatePicker
                  ref={inputStartDateRef}
                  name="start_date"
                  label="Início:"
                  defaultDate={startDate}
                  onChange={handleStartDatePicker}
                />
                <InputDatePicker
                  ref={inputEndDateRef}
                  name="end_date"
                  label="Fim:"
                  defaultDate={endDate}
                  onChange={handleEndDatePicker}
                />
                {isDateFiltered && (
                  <button
                    className="dateFilterRange"
                    type="button"
                    onClick={handleClearDateFilter}
                    title="Limpar filtros"
                  >
                    <RiFilterOffFill size={20} />
                    Limpar
                  </button>
                )}
              </div>
            </div>
            <div className="typesFilters">
              <Can roles={['ROLE_ADMIN', 'ROLE_GERENTE', 'ROLE_COORDENADOR']}>
                <Select
                  onChange={handleUserRespFilter}
                  options={userRespFilterOptions}
                  placeholder="Usuário Responsável"
                  defaultValue={
                    location.state?.userRespFilterSelected
                      ? location.state.userRespFilterSelected
                      : undefined
                  }
                  styles={selectCustomStyles}
                />
              </Can>
              <Select
                onChange={handleSelectStatusFilter}
                isMulti
                options={occurrenceStatusFilterOptions}
                placeholder="Status Ocorrência"
                defaultValue={
                  location.state?.statusFilterSelected
                    ? location.state.statusFilterSelected
                    : undefined
                }
                styles={selectCustomStyles}
              />
            </div>
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
                  <th>Valor Venda</th>
                  <th>Status</th>
                  <th />
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
                              Ocorrência não foi vinculada a um contrato.
                              Verifique no Timesharing.
                            </span>
                          </ReactTooltip>
                        </div>
                      )}
                    </td>
                    <td>{occurrence.valor_venda_formatted}</td>
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
                        userRespFilterSelected={userRespFilterSelected}
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
