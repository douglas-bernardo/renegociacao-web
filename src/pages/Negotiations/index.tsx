/* eslint-disable jsx-a11y/control-has-associated-label */
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

import { FaFilter } from 'react-icons/fa';
import { HiOutlineRefresh } from 'react-icons/hi';
import format from 'date-fns/format';
import { parseISO } from 'date-fns';

import { Container, Content, MainHeader } from '../../components/Container';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import DropNegotiationsActions from '../../components/DropNegotiationsActions';
import Whoops from '../../components/Whoops';

import Pagination, { PaginationHandles } from '../../components/Pagination';

import { Main, FilterBar, NegotiationsTable } from './styles';

import { api } from '../../services/api';
import { numberFormat } from '../../utils/numberFormat';

import Loading from '../../components/Loading';
import Tag from '../../components/Tag';

import ModalRetentionContract from '../../components/ModalRetentionContract';
import ModalDowngradeContract from '../../components/ModalDowngradeContract';
import ModalCancelContract from '../../components/ModalCancelContract';
import ModalDefaultNegotiationClose from '../../components/ModalDefaultNegotiationClose';
import InputDatePickerProps, {
  InputDatePickerHandles,
} from '../../components/InputDatePicker';

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

interface ContactType {
  id: number;
  nome: string;
}

interface Product {
  id: number;
  numeroprojeto: number;
  nomeprojeto: string;
}

interface RequestType {
  id: number;
  nome: string;
}

interface Options {
  value: string;
  label: string;
}

interface Negotiation {
  id: number;
  origem_id: number;
  origem: string;
  tipo_solicitacao_id: number;
  tipo_solicitacao: string;
  motivo: string;
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

interface LocationProps {
  limit: number | undefined;
  offset: number | undefined;
  firstPageRangeDisplayed: number | undefined;
  currentPage: number | undefined;
  situationFilter: Options[] | undefined;
  requestTypeFilter: Options[] | undefined;
}

interface Request {
  status: string;
  data: Negotiation[];
}

const selectCustomStyles = {
  container: base => ({
    ...base,
    minWidth: 200,
    marginLeft: 10,
  }),
};

const Negotiations: React.FC = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const inputStartDateRef = useRef<InputDatePickerHandles>(null);
  const inputEndDateRef = useRef<InputDatePickerHandles>(null);
  const location = useLocation<LocationProps>();
  const history = useHistory();
  const paginationRef = useRef<PaginationHandles>(null);

  const [situationOptions, setSituationOptions] = useState<Options[]>([]);
  const [tipoContatoOptions, setTipoContatoOptions] = useState<ContactType[]>(
    [],
  );
  const [produtoOptions, setProdutoOptions] = useState<Product[]>([]);
  const [situationFilterOptions, setSituationFilterOptions] = useState<
    Options[]
  >([]);
  const [requestTypeFilterOptions, setRequestTypeFilterOptions] = useState<
    Options[]
  >([]);

  const [negotiations, setNegotiations] = useState<Negotiation[]>([]);
  const [tableRefresh, setTableRefresh] = useState(false);
  const [totalNegotiations, setTotalNegotiations] = useState(0);
  const [
    selectedNegotiation,
    setSelectedNegotiation,
  ] = useState<Negotiation | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
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

  const [situationFilter, setSituationFilter] = useState<Options[]>(() => {
    if (location.state?.situationFilter) {
      return location.state.situationFilter;
    }
    return [];
  });

  const [requestTypeFilter, setRequestTypeFilter] = useState<Options[]>(() => {
    if (location.state?.requestTypeFilter) {
      return location.state.requestTypeFilter;
    }
    return [];
  });

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
    tableRefresh,
    situationFilter,
    requestTypeFilter,
    handleSetCurrentPage,
  ]);

  useEffect(() => {
    Promise.all([
      api.get(`/domain/situation`),
      api.get(`/domain/contact-type`),
      api.get(`/domain/product`),
      api.get(`/domain/request-type`),
    ])
      .then(response => {
        const [situationsRes, contactType, product, requestTypeRes] = response;

        const { data: situationsResponse } = situationsRes.data;
        const options: Options[] = situationsResponse.map((opt: Situation) => {
          return { value: opt.id, label: opt.nome };
        });
        setSituationFilterOptions(options);

        const exclude = ['1', '2', '6', '7'];
        const finalizationOptions = options.filter(option => {
          return exclude.indexOf(option.value) === -1;
        });
        setSituationOptions(finalizationOptions);

        const { data: tipoContatoResponse } = contactType.data;
        setTipoContatoOptions(
          tipoContatoResponse.map((opt: ContactType) => {
            return { value: opt.id, label: opt.nome };
          }),
        );

        const { data: produtoResponse } = product.data;
        setProdutoOptions(
          produtoResponse.map((opt: Product) => {
            return {
              value: opt.id,
              label: `${opt.numeroprojeto} - ${opt.nomeprojeto}`,
            };
          }),
        );

        const { data: requestTypeResponse } = requestTypeRes.data;
        setRequestTypeFilterOptions(
          requestTypeResponse.map((opt: RequestType) => {
            return { value: opt.id, label: opt.nome };
          }),
        );
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
          <ModalRetentionContract
            negotiation={selectedNegotiation}
            tipoContatoOptions={tipoContatoOptions}
            refreshPage={refreshPage}
          />
          <ModalDowngradeContract
            negotiation={selectedNegotiation}
            tipoContatoOptions={tipoContatoOptions}
            produtoOptions={produtoOptions}
            refreshPage={refreshPage}
          />
          <ModalCancelContract
            negotiation={selectedNegotiation}
            tipoContatoOptions={tipoContatoOptions}
            refreshPage={refreshPage}
          />
          <ModalDefaultNegotiationClose
            negotiation={selectedNegotiation}
            tipoContatoOptions={tipoContatoOptions}
            situacaoOptions={situationOptions}
            refreshPage={refreshPage}
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
            <div className="typesFilters">
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
                placeholder="Status Ocorrência"
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
                          situacaoOptions={situationOptions}
                          limit={limit}
                          offset={offset}
                          firstPageRangeDisplayed={
                            paginationRef.current?.firstPageRangeDisplayed
                          }
                          currentPage={paginationRef.current?.currentPage}
                          situationFilter={situationFilter}
                          requestTypeFilter={requestTypeFilter}
                          userRespFilterSelected={{} as Options}
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
