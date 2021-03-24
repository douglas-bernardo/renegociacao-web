import React, { useRef, useCallback, useEffect, useState } from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { api } from '../../services/api';
import { Form } from './styles';

import Modal from '../Modal';
import Input from '../Input';
import Select from '../Select';

import getValidationErros from '../../utils/getValidationErros';

interface IReversaoDTO {
  origem_id: number;
  tipo_solicitacao_id: number;
  tipo_contato_id: number;
  motivo_id: number;
  valor_financiado: number;
  reembolso: number;
  numero_pc: number;
  taxas_extras: number;
  valor_primeira_parcela: number;
  projeto_id: number;
  numerocontrato: number;
  valor_venda: number;
  observacao: string;
}

interface IModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  handleReversao: (data: IReversaoDTO) => void;
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

interface Produto {
  id: number;
  nomeprojeto: string;
}

const ModalReversao: React.FC<IModalProps> = ({
  isOpen,
  setIsOpen,
  handleReversao,
}) => {
  const formRef = useRef<FormHandles>(null);
  const [motivoOptions, setMotivoOptions] = useState<Motivo[]>([]);
  const [tipoSolOptions, setTipoSolOptions] = useState<TipoSol[]>([]);
  const [origemOptions, setOrigemOptions] = useState<Origem[]>([]);
  const [tipoContatoOptions, setTipoContatoOptions] = useState<TipoContato[]>(
    [],
  );
  const [produtoOptions, setProdutoOptions] = useState<Produto[]>([]);

  useEffect(() => {
    Promise.all([
      api.get(`/dominio/motivos`),
      api.get(`/dominio/tipo-solicitacao`),
      api.get(`/dominio/origem`),
      api.get(`/dominio/tipo-contato`),
      api.get(`/dominio/projeto`),
    ])
      .then(response => {
        const [motivos, tiposSol, origem, tipoContato, produto] = response;

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

        const { data: produtoResponse } = produto.data;
        setProdutoOptions(
          produtoResponse.map((opt: Produto) => {
            return { value: opt.id, label: opt.nomeprojeto };
          }),
        );
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  }, []);

  const handleSubmit = useCallback(
    async (data: IReversaoDTO) => {
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
          projeto_id: Yup.string().required('Produto é obrigatório'),
          numerocontrato: Yup.string().required(
            'Número Contrato é obrigatório',
          ),
          valor_venda: Yup.string().required('Valor de venda obrigatório'),
          numero_pc: Yup.string().when('reembolso', {
            is: value => value && value.length > 0,
            then: Yup.string().required(
              'Número do PC é obrigatório quando há reembolso',
            ),
            otherwise: Yup.string(),
          }),
        });

        await schema.validate(data, { abortEarly: false });

        handleReversao(data);
        setIsOpen();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErros(err);
          formRef.current?.setErrors(errors);
        }
      }
    },
    [handleReversao, setIsOpen],
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} width="912px">
      <Form ref={formRef} onSubmit={handleSubmit}>
        <h1>Finalização de Negociação | Reversão Contrato</h1>
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
        <Select
          name="projeto_id"
          options={produtoOptions}
          menuPlacement="auto"
          placeholder="Produto"
        />
        <div className="row">
          <Input
            name="numerocontrato"
            placeholder="Número Contrato Novo"
            mask="number"
          />
          <Input
            name="valor_venda"
            placeholder="Valor de Venda"
            mask="currency"
          />
          <Input name="reembolso" placeholder="Reembolso" mask="currency" />
        </div>
        <div className="row">
          <Input name="numero_pc" placeholder="Número da PC" mask="number" />
          <Input
            name="taxas_extras"
            placeholder="Taxas e Multas Extras"
            mask="currency"
          />
          <Input
            name="valor_primeira_parcela"
            placeholder="Valor 1ª Parcela"
            mask="currency"
          />
        </div>
        <Input name="observacao" placeholder="Observações" />
        <button type="submit" data-testid="add-food-button">
          <p className="text">Finalizar Reversão</p>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
};

export default ModalReversao;
