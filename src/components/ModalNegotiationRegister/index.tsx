import React, { useRef, useCallback, useEffect, useState } from 'react';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';

import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { api } from '../../services/api';
import { Form } from './styles';

import { useNegotiation } from '../../hooks/negotiation';
import { useToast } from '../../hooks/toast';

import Modal from '../Modal';
import Select from '../Select';

import getValidationErros from '../../utils/getValidationErros';

interface IOutrasFinalizacoesDTO {
  situacao_id: number;
  origem_id: number;
  tipo_solicitacao_id: number;
  tipo_contato_id: number;
  motivo_id: number;
  observacao: string;
}

interface IModalProps {
  occurrence_id?: number;
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

const ModalNegotiationRegister: React.FC<IModalProps> = ({
  occurrence_id,
  refreshPage,
}) => {
  const formRef = useRef<FormHandles>(null);
  const {
    showModalNegotiationRegister,
    negotiationRegister,
    toggleModalNegotiationRegister,
  } = useNegotiation();
  const { addToast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [motivoOptions, setMotivoOptions] = useState<Motivo[]>([]);
  const [tipoSolOptions, setTipoSolOptions] = useState<TipoSol[]>([]);
  const [origemOptions, setOrigemOptions] = useState<Origem[]>([]);

  useEffect(() => {
    Promise.all([
      api.get(`/domain/reasons`),
      api.get(`/domain/request-type`),
      api.get(`/domain/request-source`),
    ])
      .then(response => {
        const [motivos, tiposSol, origem] = response;

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
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  }, []);

  const handleSubmit = useCallback(
    async (data: IOutrasFinalizacoesDTO) => {
      if (!occurrence_id) return;
      try {
        setIsLoading(true);
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          motivo_id: Yup.string().required('Motivo é obrigatório'),
          tipo_solicitacao_id: Yup.string().required(
            'Tipo de Solicitação é obrigatório',
          ),
          origem_id: Yup.string().required('Origem é obrigatório'),
        });

        await schema.validate(data, { abortEarly: false });
        await negotiationRegister(data, occurrence_id);

        setIsLoading(false);
        toggleModalNegotiationRegister();
        refreshPage();
        addToast({
          type: 'success',
          title:
            "Negociação registrada para a ocorrência selecionada. Acesse 'Negociações' para gerenciar",
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErros(err);
          formRef.current?.setErrors(errors);
          return;
        }

        setIsLoading(false);
        addToast({
          type: 'error',
          title: 'Não Permitido',
          description: err.response.data.message
            ? err.response.data.message
            : 'Erro na solicitação',
        });
      }
    },
    [
      negotiationRegister,
      toggleModalNegotiationRegister,
      refreshPage,
      addToast,
      occurrence_id,
    ],
  );

  return (
    <Modal
      isOpen={showModalNegotiationRegister}
      setIsOpen={toggleModalNegotiationRegister}
      width="912px"
    >
      <Form ref={formRef} onSubmit={handleSubmit}>
        <h1>Registrar Negociação</h1>
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
        </div>
        <button type="submit" data-testid="add-food-button">
          <p className="text">Registar Negociação</p>
          <div className="icon">
            {isLoading ? (
              <Loader type="Oval" color="#FFF" height={24} width={24} />
            ) : (
              <FiCheckSquare size={25} />
            )}
          </div>
        </button>
      </Form>
    </Modal>
  );
};

export default ModalNegotiationRegister;
