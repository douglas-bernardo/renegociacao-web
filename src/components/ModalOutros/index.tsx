import React, { useRef, useCallback, useEffect, useState } from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { OptionsType, OptionTypeBase } from 'react-select';
import { api } from '../../services/api';
import { Form } from './styles';

import Modal from '../Modal';
import Input from '../Input';
import Select from '../Select';

import getValidationErros from '../../utils/getValidationErros';

interface IOutrosDTO {
  situacao_id: number;
  origem_id: number;
  tipo_solicitacao_id: number;
  tipo_contato_id: number;
  motivo_id: number;
  observacao: string;
}

interface IModalProps {
  isOpen: boolean;
  setIsOpen: () => void;
  handleOutros: (data: IOutrosDTO) => void;
  situacaoOptions: OptionsType<OptionTypeBase>;
  defaultSituacaoOption: OptionsType<OptionTypeBase>;
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

const ModalOutros: React.FC<IModalProps> = ({
  isOpen,
  setIsOpen,
  handleOutros,
  situacaoOptions,
  defaultSituacaoOption,
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
    async (data: IOutrosDTO) => {
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
          situacao_id: Yup.string().required('Situação é obrigatório'),
        });

        await schema.validate(data, { abortEarly: false });

        handleOutros(data);
        setIsOpen();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErros(err);
          formRef.current?.setErrors(errors);
        }
      }
    },
    [handleOutros, setIsOpen],
  );

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen} width="912px">
      <Form ref={formRef} onSubmit={handleSubmit}>
        <h1>Finalização de Negociação | Outros</h1>
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
          name="situacao_id"
          options={situacaoOptions}
          menuPlacement="auto"
          placeholder="Situação"
          defaultValue={defaultSituacaoOption}
        />
        <Input name="observacao" placeholder="Observações" />
        <button type="submit" data-testid="add-food-button">
          <p className="text">Finalizar Negociação</p>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
};

export default ModalOutros;
