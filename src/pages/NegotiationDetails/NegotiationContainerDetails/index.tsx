import { FormHandles } from '@unform/core';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { OptionTypeBase } from 'react-select';
import { FaCheck, FaPencilAlt, FaTimes } from 'react-icons/fa';
import * as Yup from 'yup';

import format from 'date-fns/format';
import { parseISO, parse, isAfter } from 'date-fns';

import Input from '../../../components/Input';
import Select from '../../../components/Select';
import { useToast } from '../../../hooks/toast';
import { api } from '../../../services/api';

import {
  Container,
  FormEditNegotiation,
  ContainerDetails,
  StaticContainerDetails,
} from './styles';
import getValidationErros from '../../../utils/getValidationErros';
import { useNegotiation } from '../../../hooks/negotiation';
import { numberFormat } from '../../../utils/numberFormat';

interface RequestSource {
  id: number;
  nome: string;
}

interface RequestType {
  id: number;
  nome: string;
}

interface Reasons {
  id: number;
  nome: string;
}

interface Negotiation {
  id: number;
  origem_id: number;
  origem: string;
  tipo_solicitacao_id: number;
  tipo_solicitacao: string;
  motivo: string;
  situacao_id: number;
  situacao: string;
  reembolso: number;
  numero_pc: number;
  taxas_extras: number;
  valor_primeira_parcela: number;
  multa: number;
  data_finalizacao: string;
}

interface INegotiationUpdateDTO {
  origem_id: number;
  tipo_solicitacao_id: number;
  motivo_id: number;
  reembolso: number;
  numero_pc: number;
  taxas_extras: number;
  multa: number;
  valor_primeira_parcela: number;
  data_finalizacao: string;
}

interface NegotiationContainerDetailsProps {
  negotiation: Negotiation;
  refreshPage: () => void;
}

const NegotiationContainerDetails: React.FC<NegotiationContainerDetailsProps> = ({
  negotiation,
  refreshPage,
}) => {
  const formRef = useRef<FormHandles>(null);
  const [negotiationEditMode, setNegotiationEditMode] = useState(false);

  const { addToast } = useToast();
  const { negotiationUpdate } = useNegotiation();

  const [reasonOptions, setReasonOptions] = useState<OptionTypeBase[]>([]);
  const [currentReason, setCurrentReason] = useState<OptionTypeBase>();

  const [requestTypeOptions, setRequestTypeOptions] = useState<
    OptionTypeBase[]
  >([]);
  const [
    currentRequestType,
    setCurrentRequestType,
  ] = useState<OptionTypeBase>();

  const [requestSourceOptions, setRequestSource] = useState<OptionTypeBase[]>(
    [],
  );
  const [
    currentRequestSource,
    setCurrentRequestSource,
  ] = useState<OptionTypeBase>();

  useEffect(() => {
    Promise.all([
      api.get(`/domain/reasons`),
      api.get(`/domain/request-type`),
      api.get(`/domain/request-source`),
    ])
      .then(response => {
        const [motivosOpt, tiposSolOpt, origemOpt] = response;

        const { data: motivoResponse } = motivosOpt.data;
        setReasonOptions(
          motivoResponse.map((opt: Reasons) => {
            return { value: opt.id, label: opt.nome };
          }),
        );

        const { data: tipoSolResponse } = tiposSolOpt.data;
        setRequestTypeOptions(
          tipoSolResponse.map((opt: RequestType) => {
            return { value: opt.id, label: opt.nome };
          }),
        );

        const { data: origemResponse } = origemOpt.data;
        setRequestSource(
          origemResponse.map((opt: RequestSource) => {
            return { value: opt.id, label: opt.nome };
          }),
        );
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  }, []);

  const handleEditNegotiation = useCallback(() => {
    setNegotiationEditMode(true);

    const currentMotivoForEdit = reasonOptions.find(opt => {
      return opt.value === negotiation?.id;
    });

    const currentRequestTypeForEdit = requestTypeOptions.find(opt => {
      return opt.value === negotiation?.tipo_solicitacao_id;
    });

    const currentRequestSourceForEdit = requestSourceOptions.find(opt => {
      return opt.value === negotiation?.origem_id;
    });

    setCurrentReason(currentMotivoForEdit);
    setCurrentRequestType(currentRequestTypeForEdit);
    setCurrentRequestSource(currentRequestSourceForEdit);
  }, [reasonOptions, requestTypeOptions, requestSourceOptions, negotiation]);

  const submitForm = useCallback(() => {
    formRef.current?.submitForm();
  }, []);

  const negotiationValuesFormatted = useMemo(() => {
    return {
      data_finalizacao: negotiation.data_finalizacao
        ? format(parseISO(negotiation.data_finalizacao), 'dd/MM/yyyy')
        : undefined,
      valor_primeira_parcela: numberFormat(negotiation.valor_primeira_parcela),
      reembolso: numberFormat(negotiation.reembolso),
      taxas_extras: numberFormat(negotiation.taxas_extras),
      multa: numberFormat(negotiation.multa),
    };
  }, [negotiation]);

  const isDateAfterToday = useCallback((date: string): boolean => {
    return isAfter(parse(date, 'dd/MM/yyyy', new Date()), new Date());
  }, []);

  const handleSubmit = useCallback(
    async (data: INegotiationUpdateDTO) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          numero_pc: Yup.string().when('reembolso', {
            is: (value: string) => value && Number(value) > 0,
            then: Yup.string().required(
              'Número do PC é obrigatório quando há reembolso',
            ),
            otherwise: Yup.string(),
          }),
          data_finalizacao: Yup.string().when('$dataFinalizacaoExist', {
            is: true,
            then: Yup.string()
              .required('Data de finalização é obrigatória')
              .nullable()
              .matches(
                /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/,
                'Data inválida. Use dd/mm/aaaa',
              ),
            otherwise: Yup.string(),
          }),
        });

        if (isDateAfterToday(data.data_finalizacao)) {
          formRef.current?.setErrors({
            data_finalizacao:
              'A data de finalização não pode ser maior que hoje',
          });
          return;
        }

        await schema.validate(data, {
          abortEarly: false,
          context: {
            dataFinalizacaoExist: !!negotiation.data_finalizacao,
          },
        });
        await negotiationUpdate(data, negotiation.id);

        setNegotiationEditMode(false);
        refreshPage();
        addToast({
          type: 'success',
          title: 'Dados da negociação atualizados',
        });
        window.scrollTo(0, 0);
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErros(err);
          formRef.current?.setErrors(errors);
          return;
        }
        console.log(err);
        addToast({
          type: 'error',
          title: 'Erro na solicitação',
        });
      }
    },
    [
      addToast,
      negotiationUpdate,
      isDateAfterToday,
      negotiation.id,
      negotiation.data_finalizacao,
      refreshPage,
    ],
  );

  return (
    <Container>
      <header>
        {negotiationEditMode ? (
          <>
            <button
              className="saveEdit"
              type="button"
              onClick={submitForm}
              title="Salvar Alterações"
            >
              <FaCheck size={28} />
            </button>
            <span className="separator" />
            <button
              className="cancelEdit"
              type="button"
              onClick={() => setNegotiationEditMode(false)}
              title="Desistir"
            >
              <FaTimes size={28} />
            </button>
          </>
        ) : (
          <button
            type="button"
            title="Editar Negociação"
            onClick={handleEditNegotiation}
          >
            <FaPencilAlt size={25} />
          </button>
        )}
      </header>
      <ContainerDetails>
        {negotiationEditMode ? (
          <FormEditNegotiation ref={formRef} onSubmit={handleSubmit}>
            <div className="row">
              <strong>Motivo</strong>
              <Select
                name="motivo_id"
                options={reasonOptions}
                menuPlacement="auto"
                defaultValue={currentReason}
                placeholder="Motivo da Solicitação de Cancelamento"
                className="selectEdit"
              />
            </div>
            <div className="row">
              <strong>Tipo de Solicitação</strong>
              <Select
                name="tipo_solicitacao_id"
                options={requestTypeOptions}
                menuPlacement="auto"
                defaultValue={currentRequestType}
                placeholder="Tipo de Solicitação"
                className="selectEdit"
              />
            </div>
            <div className="row">
              <strong>Origem</strong>
              <Select
                name="origem_id"
                options={requestSourceOptions}
                menuPlacement="auto"
                defaultValue={currentRequestSource}
                placeholder="Origem"
                className="selectEdit"
              />
            </div>
            {Number(negotiation.situacao_id) !== 1 && (
              <div className="row">
                <strong>Data Finalização</strong>
                <input name="data_exists" type="hidden" />
                <Input
                  name="data_finalizacao"
                  placeholder="Data Finalização"
                  mask="date"
                  defaultValue={negotiationValuesFormatted.data_finalizacao}
                />
              </div>
            )}
            {(Number(negotiation.situacao_id) === 6 ||
              Number(negotiation.situacao_id) === 7) && (
              <div className="row">
                <strong>Valor 1ª Parcela</strong>
                <Input
                  name="valor_primeira_parcela"
                  placeholder="Valor 1ª Parcela"
                  mask="currency"
                  defaultValue={
                    negotiationValuesFormatted.valor_primeira_parcela
                  }
                />
              </div>
            )}
            {(Number(negotiation.situacao_id) === 7 ||
              Number(negotiation.situacao_id) === 2 ||
              Number(negotiation.situacao_id) === 16) && (
              <>
                <div className="row">
                  <strong>Reembolso</strong>
                  <Input
                    name="reembolso"
                    placeholder="Reembolso"
                    mask="currency"
                    defaultValue={negotiationValuesFormatted.reembolso}
                  />
                </div>
                <div className="row">
                  <strong>Número da PC</strong>
                  <Input
                    name="numero_pc"
                    placeholder="Número da PC"
                    mask="number"
                    defaultValue={negotiation.numero_pc}
                  />
                </div>
                <div className="row">
                  <strong>Taxas Extras</strong>
                  <Input
                    name="taxas_extras"
                    placeholder="Taxas Extras"
                    mask="currency"
                    defaultValue={negotiationValuesFormatted.taxas_extras}
                  />
                </div>
              </>
            )}
            {(Number(negotiation.situacao_id) === 2 ||
              Number(negotiation.situacao_id) === 16) && (
              <div className="row">
                <strong>Multa</strong>
                <Input
                  name="multa"
                  placeholder="Multa"
                  mask="currency"
                  defaultValue={negotiationValuesFormatted.multa}
                />
              </div>
            )}
          </FormEditNegotiation>
        ) : (
          <StaticContainerDetails>
            <div>
              <strong>Motivo</strong>
              <p>{negotiation.motivo}</p>
            </div>
            <div>
              <strong>Tipo de Solicitação</strong>
              <p>{negotiation.tipo_solicitacao}</p>
            </div>
            <div>
              <strong>Origem</strong>
              <p>{negotiation.origem}</p>
            </div>
            {Number(negotiation.situacao_id) !== 1 && (
              <div>
                <strong>Data Finalização</strong>
                <p>{negotiationValuesFormatted.data_finalizacao}</p>
              </div>
            )}
            {(Number(negotiation.situacao_id) === 6 ||
              Number(negotiation.situacao_id) === 7) && (
              <div>
                <strong>Primeira Parcela</strong>
                <p>{negotiationValuesFormatted.valor_primeira_parcela}</p>
              </div>
            )}
            {(Number(negotiation.situacao_id) === 7 ||
              Number(negotiation.situacao_id) === 2 ||
              Number(negotiation.situacao_id) === 16) && (
              <>
                <div>
                  <strong>Reembolso</strong>
                  <p>{negotiationValuesFormatted.reembolso}</p>
                </div>
                <div>
                  <strong>Número da PC</strong>
                  <p>{negotiation.numero_pc}</p>
                </div>
                <div>
                  <strong>Taxas Extras</strong>
                  <p>{negotiationValuesFormatted.taxas_extras}</p>
                </div>
              </>
            )}
            {(Number(negotiation.situacao_id) === 2 ||
              Number(negotiation.situacao_id) === 16) && (
              <div>
                <strong>Multa</strong>
                <p>{negotiationValuesFormatted.multa}</p>
              </div>
            )}
          </StaticContainerDetails>
        )}
      </ContainerDetails>
    </Container>
  );
};

export default NegotiationContainerDetails;
