import React, { useRef, useCallback, useState } from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { OptionsType, OptionTypeBase } from 'react-select';
import { Form } from './styles';

import { useNegotiation } from '../../hooks/negotiation';
import { useToast } from '../../hooks/toast';

import Modal from '../Modal';
import Input from '../Input';
import Select from '../Select';

import getValidationErros from '../../utils/getValidationErros';
import ModalConfirm from '../ModalConfirm';
import LoadingModal from '../LoadingModal';

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

interface ContactType {
  id: number;
  nome: string;
}

interface IModalProps {
  negotiation: Negotiation;
  tipoContatoOptions: ContactType[];
  situacaoOptions: OptionsType<OptionTypeBase>;
  refreshPage: () => void;
}

const ModalDefaultNegotiationClose: React.FC<IModalProps> = ({
  negotiation,
  tipoContatoOptions,
  situacaoOptions,
  refreshPage,
}) => {
  const formRef = useRef<FormHandles>(null);
  const {
    defaultNegotiationClose,
    showModalDefaultNegotiationClose,
    toggleModalDefaultNegotiationClose,
    optionModalOutrosSelected,
  } = useNegotiation();
  const { addToast } = useToast();

  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [showLoadingModal, setLoadingModal] = useState(false);

  const toggleLoadingModal = useCallback(() => {
    setLoadingModal(!showLoadingModal);
  }, [showLoadingModal]);

  const toggleModalConfirm = useCallback(async () => {
    try {
      const data = formRef.current?.getData();
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        tipo_contato_id: Yup.string().required('Tipo de contato é obrigatório'),
        situacao_id: Yup.string().required('Situação é obrigatório'),
      });

      await schema.validate(data, { abortEarly: false });

      setShowModalConfirm(!showModalConfirm);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErros(err);
        formRef.current?.setErrors(errors);
      }
    }
  }, [showModalConfirm]);

  const handleModalConfirmYes = useCallback(() => {
    toggleModalConfirm();
    setLoadingModal(true);
    formRef.current?.submitForm();
  }, [toggleModalConfirm]);

  const handleSubmit = useCallback(
    async (data: IOutrasFinalizacoesDTO) => {
      try {
        await defaultNegotiationClose(data, negotiation.id);

        setLoadingModal(false);
        toggleModalDefaultNegotiationClose();
        refreshPage();
        addToast({
          type: 'success',
          title: 'Negociação Finalizada!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErros(err);
          formRef.current?.setErrors(errors);
          return;
        }

        setLoadingModal(false);
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
      <ModalConfirm
        title="Finalização de negociação"
        message={`Confirma finalização da negociação como: ${optionModalOutrosSelected.label}?`}
        confirmYes="Confirmar"
        confirmNo="Cancelar"
        isOpen={showModalConfirm}
        setIsOpen={toggleModalConfirm}
        handleConfirmYes={handleModalConfirmYes}
        buttonType={{
          theme: {
            confirmYes: 'success',
          },
        }}
      />
      <LoadingModal isOpen={showLoadingModal} setIsOpen={toggleLoadingModal} />
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
        <button
          type="button"
          data-testid="add-food-button"
          onClick={toggleModalConfirm}
        >
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
