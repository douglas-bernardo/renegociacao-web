import React, { useRef, useCallback, useState } from 'react';
import { FaExchangeAlt } from 'react-icons/fa';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { Form } from './styles';
import { useToast } from '../../hooks/toast';

import Modal from '../Modal';
import Input from '../Input';
import Select from '../Select';

import getValidationErros from '../../utils/getValidationErros';
import ModalConfirm from '../ModalConfirm';
import LoadingModal from '../LoadingModal';

export interface ITransferDTO {
  situacao_id: number;
  origem_id: number;
  tipo_solicitacao_id: number;
  tipo_contato_id: number;
  motivo_id: number;
  observacao: string;
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

interface IModalProps {
  users: User[];
  currentUserResp: number;
  transferReasonsOptions: Options[];
  handleTransferNegotiation(data: ITransferDTO): Promise<void>;
  showModalTransferNegotiation: boolean;
  toggleModalTransferNegotiation: () => void;
}

const ModalTransferNegotiation: React.FC<IModalProps> = ({
  users,
  currentUserResp,
  transferReasonsOptions,
  handleTransferNegotiation,
  showModalTransferNegotiation,
  toggleModalTransferNegotiation,
}) => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const [showModalConfirm, setShowModalConfirm] = useState(false);
  const [showLoadingModal, setLoadingModal] = useState(false);

  const [usersToTransferOptions, setUsersToTransferOptions] = useState<
    Options[]
  >([]);

  useEffect(() => {
    const options = users
      .filter(user => {
        return (
          Number(user.ativo) &&
          user.id !== currentUserResp &&
          user.roles.every(role => {
            return role.name === 'ROLE_CONSULTOR';
          })
        );
      })
      .sort((a: User, b: User) => {
        return a.primeiro_nome.localeCompare(b.primeiro_nome);
      })
      .map((opt: User) => {
        return { value: opt.id.toString(), label: opt.primeiro_nome };
      });

    setUsersToTransferOptions(options);
  }, [users, currentUserResp]);

  const toggleModalConfirm = useCallback(async () => {
    try {
      const data = formRef.current?.getData();
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        usuario_novo_id: Yup.string().required('Novo usuário é obrigatório'),
        motivo_transferencia_id: Yup.string().required('Motivo é obrigatório'),
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
    async (data: ITransferDTO) => {
      try {
        await handleTransferNegotiation(data);

        setLoadingModal(false);
        toggleModalTransferNegotiation();
        addToast({
          type: 'success',
          title: 'Negociação transferida com sucesso!',
        });
      } catch (err) {
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
    [handleTransferNegotiation, toggleModalTransferNegotiation, addToast],
  );

  return (
    <Modal
      isOpen={showModalTransferNegotiation}
      setIsOpen={toggleModalTransferNegotiation}
      width="912px"
    >
      <ModalConfirm
        title="ATENÇÃO!"
        message={
          'A transferência de negociações acarretará em alterações na performance dos consultores.\n\n Confirma transferência da negociação?'
        }
        note="Obs.: A transferência não irá alterar o responsável pela ocorrência correspondente no timesharing"
        confirmYes="Confirmar"
        confirmNo="Cancelar"
        isOpen={showModalConfirm}
        setIsOpen={toggleModalConfirm}
        handleConfirmYes={handleModalConfirmYes}
        buttonType={{
          theme: {
            confirmYes: 'danger',
          },
        }}
      />
      <LoadingModal isOpen={showLoadingModal} />
      <Form ref={formRef} onSubmit={handleSubmit}>
        <h1>Transferência de Negociação</h1>
        <div className="control">
          <Select
            name="usuario_novo_id"
            options={usersToTransferOptions}
            menuPlacement="auto"
            placeholder="Novo Negociador"
          />
        </div>
        <Select
          name="motivo_transferencia_id"
          options={transferReasonsOptions}
          menuPlacement="auto"
          placeholder="Motivo da transferência"
        />
        <Input name="observacoes" placeholder="Observações" />
        <button
          type="button"
          data-testid="add-food-button"
          onClick={toggleModalConfirm}
        >
          <p className="text">Transferir Negociação</p>
          <div className="icon">
            <FaExchangeAlt size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );
};

export default ModalTransferNegotiation;
