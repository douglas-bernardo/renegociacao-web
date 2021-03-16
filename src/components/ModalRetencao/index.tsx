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

interface IRetencaoDTO {
  origem_id: number;
  tipo_solicitacao_id: number;
  tipo_contato_id: number;
  motivo_id: number;
  valor_primeira_parcela: number;
  observacao: string;
  valor_financiado: number;
}

interface IModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  handleRetencao: (data: IRetencaoDTO) => void;
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

const ModalRetencao: React.FC<IModalProps> = ({
  isOpen,
  setIsOpen,
  handleRetencao,
}) => {
  const formRef = useRef<FormHandles>(null);
  const [motivoOptions, setMotivoOptions] = useState<Motivo[]>([]);
  const [tipoSolOptions, setTipoSolOptions] = useState<TipoSol[]>([]);
  const [origemOptions, setOrigemOptions] = useState<Origem[]>([]);
  const [tipoContatoOptions, setTipoContatoOptions] = useState<TipoContato[]>(
    [],
  );

  useEffect(() => {
    Promise.all([
      api.get(`/dominio/motivos`),
      api.get(`/dominio/tipo-solicitacao`),
      api.get(`/dominio/origem`),
      api.get(`/dominio/tipo-contato`),
    ])
      .then(response => {
        const [motivos, tiposSol, origem, tipoContato] = response;

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
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  }, []);

  const handleSubmit = useCallback(
    async (data: IRetencaoDTO) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          valor_financiado: Yup.string().required(
            'Valor financiado obrigatório',
          ),
          motivo_id: Yup.string().required('Motivo é obrigatório'),
          tipo_solicitacao_id: Yup.string().required(
            'Tipo de Solicitação é obrigatório',
          ),
          origem_id: Yup.string().required('Origem é obrigatório'),
          tipo_contato_id: Yup.string().required(
            'Tipo de contato é obrigatório',
          ),
        });

        await schema.validate(data, { abortEarly: false });

        handleRetencao(data);
        setIsOpen();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErros(err);
          formRef.current?.setErrors(errors);
        }
      }
    },
    [handleRetencao, setIsOpen],
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} width="912px">
      <Form ref={formRef} onSubmit={handleSubmit}>
        <h1>Retenção Contrato</h1>
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
            name="valor_financiado"
            placeholder="Valor Financiado"
            mask="currency"
          />
          <Input
            name="valor_primeira_parcela"
            placeholder="Valor 1ª Parcela"
            mask="currency"
          />
        </div>

        <button type="submit" data-testid="add-food-button">
          <p className="text">Finalizar Retenção</p>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
};

export default ModalRetencao;
