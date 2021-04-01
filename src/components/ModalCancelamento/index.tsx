import React, { useRef, useCallback, useEffect, useState } from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';

import format from 'date-fns/format';
import { parseISO } from 'date-fns';

import * as Yup from 'yup';

import { api } from '../../services/api';
import { Container, Form } from './styles';

import { useNegociacao } from '../../hooks/negociacao';
import { useToast } from '../../hooks/toast';

import Modal from '../Modal';
import Input from '../Input';
import Select from '../Select';

import getValidationErros from '../../utils/getValidationErros';
import { numberFormat } from '../../utils/numberFormat';
import Tabs from '../Tabs';
import Tab from '../Tab';
import { Card, CardBody, CardHeader } from '../Container';

interface ICancelamentoDTO {
  origem_id: number;
  tipo_solicitacao_id: number;
  tipo_contato_id: number;
  motivo_id: number;
  valor_financiado: number;
  reembolso: number;
  numero_pc: number;
  taxas_extras: number;
  observacao: string;
  multa: string;
}

interface IModalProps {
  ocorrencia_id: string;
  refreshPage: () => void;
}

interface Motivo {
  id: number;
  nome: string;
}

interface TipoSol {
  id: number;
  nome: string;
}

interface Origem {
  id: number;
  nome: string;
}

interface TipoContato {
  id: number;
  nome: string;
}

interface Contrato {
  nome_cliente: string;
  numeroprojeto: number;
  numerocontrato: number;
  valor_venda: string;
  valorVendaFormatted: string;
  produto: string;
}

const ModalCancelamento: React.FC<IModalProps> = ({
  ocorrencia_id,
  refreshPage,
}) => {
  const formRef = useRef<FormHandles>(null);
  const {
    cancelamento,
    showModalCancelamnto,
    toggleModalCancelamento,
  } = useNegociacao();
  const { addToast } = useToast();

  const [motivoOptions, setMotivoOptions] = useState<Motivo[]>([]);
  const [tipoSolOptions, setTipoSolOptions] = useState<TipoSol[]>([]);
  const [origemOptions, setOrigemOptions] = useState<Origem[]>([]);
  const [tipoContatoOptions, setTipoContatoOptions] = useState<TipoContato[]>(
    [],
  );
  const [contrato, setContrato] = useState<Contrato>({} as Contrato);

  useEffect(() => {
    Promise.all([
      api.get(`/dominio/motivos`),
      api.get(`/dominio/tipo-solicitacao`),
      api.get(`/dominio/origem`),
      api.get(`/dominio/tipo-contato`),
      api.get(`ocorrencias/${ocorrencia_id}`),
    ])
      .then(response => {
        const [
          motivos,
          tiposSol,
          origem,
          tipoContato,
          contratoDetalhe,
        ] = response;

        const { data: motivoResponse } = motivos.data;
        setMotivoOptions(
          motivoResponse.map((opt: Motivo) => {
            return { value: opt.id, label: opt.nome };
          }),
        );

        const { data: tipoSolResponse } = tiposSol.data;
        setTipoSolOptions(
          tipoSolResponse.map((opt: TipoSol) => {
            return { value: opt.id, label: opt.nome };
          }),
        );

        const { data: origemResponse } = origem.data;
        setOrigemOptions(
          origemResponse.map((opt: Origem) => {
            return { value: opt.id, label: opt.nome };
          }),
        );

        const { data: tipoContatoResponse } = tipoContato.data;
        setTipoContatoOptions(
          tipoContatoResponse.map((opt: TipoContato) => {
            return { value: opt.id, label: opt.nome };
          }),
        );

        const { data: contratoResponse } = contratoDetalhe.data;
        setContrato({
          ...contratoResponse,
          dateFormatted: format(
            parseISO(contratoResponse.dtocorrencia),
            'dd-MM-yyyy HH:mm:ss',
          ),
          valorVendaFormatted: numberFormat(contratoResponse.valor_venda),
        });
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  }, [ocorrencia_id]);

  const handleSubmit = useCallback(
    async (data: ICancelamentoDTO) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          motivo_id: Yup.string().required('Motivo é obrigatório'),
          tipo_solicitacao_id: Yup.string().required(
            'Tipo de Solicitação é obrigatório',
          ),
          origem_id: Yup.string().required('Origem é obrigatório'),
          tipo_contato_id: Yup.string().required(
            'Tipo de contato é obrigatório',
          ),
          numero_pc: Yup.string().when('reembolso', {
            is: (value: string) => value && value.length > 0,
            then: Yup.string().required(
              'Número do PC é obrigatório quando há reembolso',
            ),
            otherwise: Yup.string(),
          }),
        });

        await schema.validate(data, { abortEarly: false });
        await cancelamento(data, ocorrencia_id);

        toggleModalCancelamento();
        refreshPage();
        addToast({
          type: 'success',
          title: 'Ocorrência Finalizada!',
          description: 'Cancelamento de Contrato',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErros(err);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na solicitação',
        });
      }
    },
    [
      cancelamento,
      toggleModalCancelamento,
      refreshPage,
      addToast,
      ocorrencia_id,
    ],
  );

  return (
    <Modal
      isOpen={showModalCancelamnto}
      setIsOpen={toggleModalCancelamento}
      width="912px"
    >
      <Container>
        <h1>Finalização de Negociação | Cancelamento Contrato</h1>
        <Tabs>
          <Tab title="Dados">
            <Form ref={formRef} onSubmit={handleSubmit}>
              <Select
                name="motivo_id"
                options={motivoOptions}
                menuPlacement="auto"
                placeholder="Motivo da Solicitação de Cancelamento"
              />
              <div className="control">
                <Select
                  name="tipo_solicitacao_id"
                  options={tipoSolOptions}
                  menuPlacement="auto"
                  placeholder="Tipo de Solicitação"
                />
                <Select
                  name="origem_id"
                  options={origemOptions}
                  menuPlacement="auto"
                  placeholder="Origem"
                />
                <Select
                  name="tipo_contato_id"
                  options={tipoContatoOptions}
                  menuPlacement="auto"
                  placeholder="Tipo de Contato"
                />
              </div>
              <div className="row">
                <Input
                  name="multa"
                  placeholder="Multa Cancelamento"
                  mask="currency"
                />
                <Input
                  name="reembolso"
                  placeholder="Reembolso"
                  mask="currency"
                />
                <Input
                  name="numero_pc"
                  placeholder="Número da PC"
                  mask="number"
                />
              </div>
              <div className="row">
                <Input
                  name="taxas_extras"
                  placeholder="Taxas e Multas Extras"
                  mask="currency"
                />
              </div>
              <Input name="observacao" placeholder="Observações" />
              <button type="submit" data-testid="add-food-button">
                <p className="text">Finalizar Cancelamento</p>
                <div className="icon">
                  <FiCheckSquare size={24} />
                </div>
              </button>
            </Form>
          </Tab>
          <Tab title="Contrato">
            <Card>
              <CardHeader>
                <h3>Contrato</h3>
              </CardHeader>
              <CardBody>
                <div className="row">
                  <span>Cliente:</span>
                  <div>{contrato.nome_cliente}</div>
                </div>
                <div className="row">
                  <span>Contrato:</span>
                  <div>
                    {`${contrato.numeroprojeto}-${contrato.numerocontrato}`}
                  </div>
                </div>
                <div className="row">
                  <span>Valor de Venda:</span>
                  <div>{contrato.valorVendaFormatted}</div>
                </div>
                <div className="row">
                  <span>Produto:</span>
                  <div>{contrato.produto}</div>
                </div>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </Container>
    </Modal>
  );
};

export default ModalCancelamento;
