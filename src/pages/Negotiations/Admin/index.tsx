import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Select from 'react-select';
import * as Yup from 'yup';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';

import { RiFilterOffFill } from 'react-icons/ri';
import { HiOutlineRefresh } from 'react-icons/hi';
import format from 'date-fns/format';
import { parseISO } from 'date-fns';

import { Container, Content, MainHeader } from '../../../components/Container';
import Sidebar from '../../../components/Sidebar';
import Header from '../../../components/Header';
import DropNegotiationsActions from '../../../components/DropNegotiationsActions/Admin';
import Whoops from '../../../components/Whoops';

import Pagination, { PaginationHandles } from '../../../components/Pagination';

import { Main, FilterBar, NegotiationsTable } from '../styles';

import { api } from '../../../services/api';
import { numberFormat } from '../../../utils/numberFormat';

import Loading from '../../../components/Loading';
import Tag from '../../../components/Tag';

import InputDatePickerProps, {
  InputDatePickerHandles,
} from '../../../components/InputDatePicker';

import ModalTransferNegotiation, {
  ITransferDTO,
} from '../../../components/ModalTransferNegotiation';
import ModalConfirm from '../../../components/ModalConfirm';
import LoadingModal from '../../../components/LoadingModal';
import { useToast } from '../../../hooks/toast';
import { getValidationErrors } from '../../../utils/getValidationErrors';

const situationStyles = {
  '1': 'warning',
  '2': 'critical',
  '6': 'success',
  '7': 'info',
};

interface Situation {
  id: number;
  nome: string;
}

interface RequestType {
  id: number;
  nome: string;
}

interface TransferType {
  id: number;
  nome: string;
}

interface Options {
  value: string;
  label: string;
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

interface LocationProps {
  limit: number | undefined;
  offset: number | undefined;
  firstPageRangeDisplayed: number | undefined;
  currentPage: number | undefined;
  situationFilter: Options[] | undefined;
  requestTypeFilter: Options[] | undefined;
  userRespFilterSelected: Options | undefined;
}

interface Request {
  status: string;
  data: Negotiation[];
}

interface Negotiation {
  id: number;
  origem_id: number;
  origem: string;
  tipo_solicitacao_id: number;
  tipo_solicitacao: string;
  motivo: string;
  usuario_id: number;
  usuario_resp_negociacao: string;
  situacao_id: number;
  situacao: string;
  reembolso: number;
  numero_pc: number;
  taxas_extras: number;
  valor_primeira_parcela: number;
  multa: number;
  observacao: string;
  numero_ocorrencia: number;
  data_ocorrencia: string;
  data_ocorrencia_formatted: string;
  nomeusuario_cadastro: string;
  departamento: string;
  nome_cliente: string;
  numeroprojeto: string;
  numerocontrato: string;
  produto: string;
  valor_venda: number;
  valor_venda_formatted: string;
  status_ts: string;
}

const selectCustomStyles = {
  container: base => ({
    ...base,
    minWidth: 210,
    marginLeft: 10,
  }),
};

const Negotiations: React.FC = () => {
  /** dialog */
  const { addToast } = useToast();
  /** Page Behavior */
  const searchInputRef = useRef<HTMLInputElement>(null);
  const inputStartDateRef = useRef<InputDatePickerHandles>(null);
  const inputEndDateRef = useRef<InputDatePickerHandles>(null);
  const location = useLocation<LocationProps>();
  const history = useHistory();
  const paginationRef = useRef<PaginationHandles>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [tableRefresh, setTableRefresh] = useState(false);

  /** Modal states and options */
  const [showLoadingModal, setLoadingModal] = useState(false);
  const [
    showModalTransferNegotiation,
    setShowModalTransferNegotiation,
  ] = useState(false);
  const [usersToTransferOptions, setUsersToTransferOptions] = useState<User[]>(
    [],
  );
  const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false);
  const [showModalConfirmRestore, setShowModalConfirmRestore] = useState(false);

  /** Filter options */
  const [situationFilterOptions, setSituationFilterOptions] = useState<
    Options[]
  >([]);
  const [requestTypeFilterOptions, setRequestTypeFilterOptions] = useState<
    Options[]
  >([]);
  const [userRespFilterOptions, setUserFilterRespOptions] = useState<Options[]>(
    [],
  );
  const [transferReasonsOptions, setTransferReasonsOptions] = useState<
    Options[]
  >([]);

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

  const [isDateFiltered, setIsDateFiltered] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    return new Date(new Date().getFullYear(), 0, 1);
  });

  const [endDate, setEndDate] = useState(() => {
    return new Date();
  });

  const [userRespFilterSelected, setUserRespFilterSelected] = useState<
    Options | undefined
  >(() => {
    if (location.state?.userRespFilterSelected) {
      return location.state.userRespFilterSelected;
    }
    return undefined;
  });

  const [requestTypeFilter, setRequestTypeFilter] = useState<Options[]>(() => {
    if (location.state?.requestTypeFilter) {
      return location.state.requestTypeFilter;
    }
    return [];
  });

  const [situationFilter, setSituationFilter] = useState<Options[]>(() => {
    if (location.state?.situationFilter) {
      return location.state.situationFilter;
    }
    return [];
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

  /** Domain */
  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [totalNegotiations, setTotalNegotiations] = useState(0);
  const [
    selectedNegotiation,
    setSelectedNegotiation,
  ] = useState<Negotiation | null>(null);

  /** Api Requests */
  useEffect(() => {
    const situations = situationFilter.map(item => {
      return item.value;
    });
    const ids = situations.join().length > 0 ? situations.join() : 0;

    const requestTypes = requestTypeFilter.map(item => {
      return item.value;
    });
    const RequestsIds =
      requestTypes.join().length > 0 ? requestTypes.join() : 0;

    api
      .get<Request>('/negotiations', {
        params: {
          year: 2021,
          offset,
          limit,
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
          situacao_id: ids,
          tipo_solicitacao_id: RequestsIds,
          userResp: userRespFilterSelected?.value,
        },
      })
      .then(response => {
        setTotalNegotiations(response.headers['x-total-count']);
        const { data } = response.data;
        const negotiationsFormatted = data.map((negotiation: Negotiation) => {
          return {
            ...negotiation,
            valor_venda_formatted: numberFormat(negotiation.valor_venda),
            data_ocorrencia_formatted: format(
              parseISO(negotiation.data_ocorrencia),
              'dd-MM-yyyy',
            ),
          };
        });
        setNegotiations(negotiationsFormatted);
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
    tableRefresh,
    situationFilter,
    requestTypeFilter,
    userRespFilterSelected?.value,
    handleSetCurrentPage,
  ]);

  useEffect(() => {
    Promise.all([
      api.get(`/domain/situation`),
      api.get('/domain/transfer-reasons'),
      api.get(`/domain/request-type`),
      api.get('/users'),
    ])
      .then(response => {
        const [situationsRes, transferRes, requestTypeRes, usersRes] = response;

        const { data: situationsResponse } = situationsRes.data;
        setSituationFilterOptions(
          situationsResponse.map((opt: Situation) => {
            return { value: opt.id, label: opt.nome };
          }),
        );

        const { data: transferResponse } = transferRes.data;
        setTransferReasonsOptions(
          transferResponse.map((opt: TransferType) => {
            return { value: opt.id, label: opt.nome };
          }),
        );

        const { data: requestTypeResponse } = requestTypeRes.data;
        setRequestTypeFilterOptions(
          requestTypeResponse.map((opt: RequestType) => {
            return { value: opt.id, label: opt.nome };
          }),
        );

        const { data: usersResponse } = usersRes.data;
        setUsersToTransferOptions(usersResponse);
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
            return { value: opt.id, label: opt.primeiro_nome };
          })
          .sort((a: Options, b: Options) => {
            return a.label.localeCompare(b.label);
          });
        setUserFilterRespOptions([
          { value: '0', label: 'Todos' },
          ...usersFilterOptions,
        ]);
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  }, []);

  const refreshPage = useCallback(() => {
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
      .get('/negotiations-search', {
        params: {
          param: searchInputRef.current?.value,
        },
      })
      .then(response => {
        const { data } = response.data;
        const negotiationsFormatted = data.map((negotiation: Negotiation) => {
          return {
            ...negotiation,
            valor_venda_formatted: numberFormat(negotiation.valor_venda),
            data_ocorrencia_formatted: format(
              parseISO(negotiation.data_ocorrencia),
              'dd-MM-yyyy',
            ),
          };
        });
        setNegotiations(negotiationsFormatted);
        setIsLoading(false);
        setTotalNegotiations(0);
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

  const handleSelectSituationFilter = useCallback(
    (selected: any) => {
      setIsLoading(true);

      setSituationFilter(selected);
      setOffset(0);

      paginationRef.current?.handleSetCurrentPage(1);
      paginationRef.current?.handleSetFirstPageRangeDisplayed(0);
      if (location.state) {
        history.replace(location.pathname, null);
      }
    },
    [location, history],
  );

  const handleSelectRequestTypeFilter = useCallback(
    (selected: any) => {
      setTotalNegotiations(0);
      setNegotiations([]);
      setIsLoading(true);

      setRequestTypeFilter(selected);
      setOffset(0);

      paginationRef.current?.handleSetCurrentPage(1);
      paginationRef.current?.handleSetFirstPageRangeDisplayed(0);
      if (location.state) {
        history.replace(location.pathname, null);
      }
    },
    [location, history],
  );

  const toggleModalTransferNegotiation = useCallback(() => {
    setShowModalTransferNegotiation(!showModalTransferNegotiation);
  }, [showModalTransferNegotiation]);

  const handleTransferNegotiation = useCallback(
    async (data: ITransferDTO) => {
      await api.put(`/negotiations/${selectedNegotiation?.id}/transfer`, data);
      refreshPage();
    },
    [selectedNegotiation?.id, refreshPage],
  );

  const toggleModalConfirmDeleteNegotiation = useCallback(() => {
    setShowModalConfirmDelete(!showModalConfirmDelete);
  }, [showModalConfirmDelete]);

  const handleDeleteNegotiation = useCallback(() => {
    toggleModalConfirmDeleteNegotiation();
    setLoadingModal(true);
    api
      .delete(`/negotiations/${selectedNegotiation?.id}`)
      .then(() => {
        setLoadingModal(false);
        refreshPage();
      })
      .catch(error => {
        setLoadingModal(false);
        addToast({
          type: 'error',
          title: 'Não Permitido',
          description: error.response.data.message
            ? error.response.data.message
            : 'Erro na solicitação',
        });
      });
  }, [
    toggleModalConfirmDeleteNegotiation,
    selectedNegotiation?.id,
    refreshPage,
    addToast,
  ]);

  const toggleModalConfirmRestoreNegotiation = useCallback(() => {
    setShowModalConfirmRestore(!showModalConfirmRestore);
  }, [showModalConfirmRestore]);

  const handleRestoreNegotiation = useCallback(() => {
    toggleModalConfirmRestoreNegotiation();
    setLoadingModal(true);
    api
      .put(`/negotiations/${selectedNegotiation?.id}/restore`)
      .then(() => {
        refreshPage();
        setLoadingModal(false);
        addToast({
          type: 'success',
          title: 'Negociação restaurada com sucesso!',
        });
      })
      .catch(err => {
        addToast({
          type: 'error',
          title: 'Não Permitido',
          description: err.response.data.message
            ? err.response.data.message
            : 'Erro na solicitação',
        });
      });
  }, [
    addToast,
    toggleModalConfirmRestoreNegotiation,
    selectedNegotiation?.id,
    refreshPage,
  ]);

  const handleButtonRefreshPage = useCallback(() => {
    setIsLoading(true);
    setBtnLoading(true);
    refreshPage();
  }, [refreshPage]);

  return (
    <Container>
      <Sidebar />
      {selectedNegotiation && (
        <>
          <LoadingModal isOpen={showLoadingModal} />
          <ModalTransferNegotiation
            users={usersToTransferOptions}
            currentUserResp={selectedNegotiation.usuario_id}
            transferReasonsOptions={transferReasonsOptions}
            handleTransferNegotiation={handleTransferNegotiation}
            showModalTransferNegotiation={showModalTransferNegotiation}
            toggleModalTransferNegotiation={toggleModalTransferNegotiation}
          />
          <ModalConfirm
            title="ATENÇÃO!"
            message="Ao excluir essa negociação o negociador responsável não mais poderá gerenciá-la. Essa ação acarretará em alterações na performance do mesmo. Confirma a exclusão?"
            note="Ao clicar em 'Confirmar' essa ação não poderá ser desfeita!"
            confirmYes="Confirmar"
            confirmNo="Cancelar"
            isOpen={showModalConfirmDelete}
            setIsOpen={toggleModalConfirmDeleteNegotiation}
            handleConfirmYes={handleDeleteNegotiation}
            buttonType={{
              theme: {
                confirmYes: 'danger',
              },
            }}
          />
          <ModalConfirm
            title="ATENÇÃO!"
            message="Ao restaurar essa negociação para 'Aguardando Retorno', a performance do negociador responsável será alterada e os registros da negociação serão perdidos. Confirma a ação?"
            note="Ao clicar em 'Confirmar' essa ação não poderá ser desfeita!"
            confirmYes="Confirmar"
            confirmNo="Cancelar"
            isOpen={showModalConfirmRestore}
            setIsOpen={toggleModalConfirmRestoreNegotiation}
            handleConfirmYes={handleRestoreNegotiation}
            buttonType={{
              theme: {
                confirmYes: 'danger',
              },
            }}
          />
        </>
      )}
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
            <h1>Negociações</h1>
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
              <span>Ciclo Iniciação:</span>
              <div className="inputDates">
                <InputDatePickerProps
                  ref={inputStartDateRef}
                  name="start_date"
                  label="Início:"
                  defaultDate={startDate}
                  onChange={handleStartDatePicker}
                />
                <InputDatePickerProps
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
              <Select
                onChange={handleSelectRequestTypeFilter}
                isMulti
                options={requestTypeFilterOptions}
                placeholder="Tipo de Solicitação"
                defaultValue={
                  location.state?.requestTypeFilter
                    ? location.state.requestTypeFilter
                    : undefined
                }
                styles={selectCustomStyles}
              />
              <Select
                onChange={handleSelectSituationFilter}
                isMulti
                options={situationFilterOptions}
                placeholder="Situação"
                defaultValue={
                  location.state?.situationFilter
                    ? location.state.situationFilter
                    : undefined
                }
                styles={selectCustomStyles}
              />
            </div>
          </FilterBar>
          {isLoading ? (
            <Loading />
          ) : (
            <NegotiationsTable>
              <thead>
                <tr>
                  <th>Ocorrência</th>
                  <th>Data Sol.</th>
                  <th>Responsável</th>
                  <th>Tipo</th>
                  <th>Cliente</th>
                  <th>Contrato</th>
                  <th>Valor</th>
                  <th className="centered situation">Situação</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {negotiations &&
                  negotiations.map(negotiation => (
                    <tr
                      key={negotiation.id}
                      onClick={() => setSelectedNegotiation(negotiation)}
                    >
                      <td>{negotiation.numero_ocorrencia}</td>
                      <td>{negotiation.data_ocorrencia_formatted}</td>
                      <td>{negotiation.usuario_resp_negociacao}</td>
                      <td>{negotiation.tipo_solicitacao}</td>
                      <td>{negotiation.nome_cliente}</td>
                      <td>
                        {`${negotiation.numeroprojeto}-${negotiation.numerocontrato}`}
                      </td>
                      <td>{negotiation.valor_venda_formatted}</td>
                      <td>
                        <Tag
                          theme={
                            situationStyles[negotiation.situacao_id] ||
                            'default'
                          }
                        >
                          {negotiation.situacao}
                        </Tag>
                      </td>
                      <td className="centered">
                        <DropNegotiationsActions
                          negotiationProps={{
                            id: negotiation.id,
                            situation_id: negotiation.situacao_id,
                          }}
                          limit={limit}
                          offset={offset}
                          firstPageRangeDisplayed={
                            paginationRef.current?.firstPageRangeDisplayed
                          }
                          currentPage={paginationRef.current?.currentPage}
                          situationFilter={situationFilter}
                          requestTypeFilter={requestTypeFilter}
                          userRespFilterSelected={userRespFilterSelected}
                          toggleModalTransferNegotiation={
                            toggleModalTransferNegotiation
                          }
                          toggleModalConfirmDeleteNegotiation={
                            toggleModalConfirmDeleteNegotiation
                          }
                          toggleModalConfirmRestoreNegotiation={
                            toggleModalConfirmRestoreNegotiation
                          }
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </NegotiationsTable>
          )}
          {totalNegotiations > 0 && (
            <Pagination
              ref={paginationRef}
              count={totalNegotiations}
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

export default Negotiations;
