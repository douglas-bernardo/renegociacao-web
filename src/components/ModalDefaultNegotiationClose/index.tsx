import React, { useRef, useCallback, useEffect, useState } from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { OptionsType, OptionTypeBase } from 'react-select';
import { api } from '../../services/api';
import { Form } from './styles';

import { useNegotiation } from '../../hooks/negotiation';
import { useToast } from '../../hooks/toast';

import Modal from '../Modal';
import Input from '../Input';
import Select from '../Select';

import getValidationErros from '../../utils/getValidationErros';

interface Negotiation {
  id: number;
}

interface IOutrasFinalizacoesDTO {
  situacao_id: number;
  origem_id: number;
  tipo_solicitacao_id: number;
  tipo_contato_id: number;
  motivo_id: number;
  observacao: string;
}

interface IModalProps {
  negotiation: Negotiation;
  refreshPage: () => void;
  situacaoOptions: OptionsType<OptionTypeBase>;
}

interface ContactType {
  id: number;
  nome: string;
}

const ModalDefaultNegotiationClose: React.FC<IModalProps> = ({
  negotiation,
  refreshPage,
  situacaoOptions,
}) => {
  const formRef = useRef<FormHandles>(null);
  const {
    defaultNegotiationClose,
    showModalDefaultNegotiationClose,
    toggleModalDefaultNegotiationClose,
    optionModalOutrosSelected,
  } = useNegotiation();
  const { addToast } = useToast();

  const [tipoContatoOptions, setTipoContatoOptions] = useState<ContactType[]>(
    [],
  );

  useEffect(() => {
    api
      .get(`/domain/contact-type`)
      .then(response => {
        const { data } = response.data;

        setTipoContatoOptions(
          data.map((opt: ContactType) => {
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
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          tipo_contato_id: Yup.string().required(
            'Tipo de contato é obrigatório',
          ),
          situacao_id: Yup.string().required('Situação é obrigatório'),
        });

        await schema.validate(data, { abortEarly: false });
        await defaultNegotiationClose(data, negotiation.id);

        toggleModalDefaultNegotiationClose();
        refreshPage();
        addToast({
          type: 'success',
          title: 'Ocorrência Finalizada!',
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
      defaultNegotiationClose,
      toggleModalDefaultNegotiationClose,
      refreshPage,
      addToast,
      negotiation.id,
    ],
  );

  return (
    <Modal
      isOpen={showModalDefaultNegotiationClose}
      setIsOpen={toggleModalDefaultNegotiationClose}
      width="912px"
    >
      <Form ref={formRef} onSubmit={handleSubmit}>
        <h1>Finalização de Negociação | Outros</h1>
        <div className="control">
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
          defaultValue={optionModalOutrosSelected}
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

export default ModalDefaultNegotiationClose;
