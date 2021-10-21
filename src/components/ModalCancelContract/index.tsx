import React, { useRef, useCallback, useState } from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';

import * as Yup from 'yup';

import { Container, Form } from './styles';

import { useNegotiation } from '../../hooks/negotiation';
import { useToast } from '../../hooks/toast';

import Modal from '../Modal';
import Input from '../Input';
import Select from '../Select';

import { getValidationErrors } from '../../utils/getValidationErrors';
import Tabs from '../Tabs';
import Tab from '../Tab';
import { Card, CardBody, CardHeader } from '../Container';
import ModalConfirm from '../ModalConfirm';
import LoadingModal from '../LoadingModal';

interface Negotiation {
  id: number;
  valor_primeira_parcela: number;
  nome_cliente: string;
  numeroprojeto: string;
  numerocontrato: string;
  produto: string;
  valor_venda: number;
  valor_venda_formatted: string;
}

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

interface ContactType {
  id: number;
  nome: string;
}

interface IModalProps {
  negotiation: Negotiation;
  tipoContatoOptions: ContactType[];
  refreshPage: () => void;
}

const ModalCancelContract: React.FC<IModalProps> = ({
  negotiation,
  tipoContatoOptions,
  refreshPage,
}) => {
  const formRef = useRef<FormHandles>(null);
  const {
    cancelContract,
    showModalCancelContract,
    toggleModalCancelContract,
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
        numero_pc: Yup.string().when('reembolso', {
          is: (value: string) => value && value.length > 0,
          then: Yup.string().required(
            'Número do PC é obrigatório quando há reembolso',
          ),
          otherwise: Yup.string(),
        }),
      });

      await schema.validate(data, { abortEarly: false });
      setShowModalConfirm(!showModalConfirm);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
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
    async (data: ICancelamentoDTO) => {
      try {
        await cancelContract(data, negotiation.id);

        setLoadingModal(false);
        toggleModalCancelContract();
        refreshPage();
        addToast({
          type: 'success',
          title: 'Negociação Finalizada!',
          description: 'Cancelamento de Contrato',
        });
      } catch (err: any) {
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
      cancelContract,
      toggleModalCancelContract,
      refreshPage,
      addToast,
      negotiation.id,
    ],
  );

  return (
    <Modal
      isOpen={showModalCancelContract}
      setIsOpen={toggleModalCancelContract}
      width="912px"
    >
      <ModalConfirm
        title="Cancelamento de Contrato"
        message={`Confirma o CANCELAMENTO do contrato ${negotiation.numeroprojeto}-${negotiation.numerocontrato}?`}
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
      <Container>
        <h1>Finalização de Negociação | Cancelamento Contrato</h1>
        <Tabs>
          <Tab title="Dados">
            <Form ref={formRef} onSubmit={handleSubmit}>
              <div className="control">
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
                  placeholder="Taxas Extras"
                  mask="currency"
                />
              </div>
              <Input name="observacao" placeholder="Observações" />
              <button
                type="button"
                data-testid="add-food-button"
                onClick={toggleModalConfirm}
              >
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
                  <div>{negotiation.nome_cliente}</div>
                </div>
                <div className="row">
                  <span>Contrato:</span>
                  <div>
                    {`${negotiation.numeroprojeto}-${negotiation.numerocontrato}`}
                  </div>
                </div>
                <div className="row">
                  <span>Valor de Venda:</span>
                  <div>{negotiation.valor_venda_formatted}</div>
                </div>
                <div className="row">
                  <span>Produto:</span>
                  <div>{negotiation.produto}</div>
                </div>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </Container>
    </Modal>
  );
};

export default ModalCancelContract;
