import React, { useRef, useCallback, useState } from 'react';

import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';

import * as Yup from 'yup';
import { Container, Form } from './styles';
import { Card, CardBody, CardHeader } from '../Container';

import { useNegotiation } from '../../hooks/negotiation';
import { useToast } from '../../hooks/toast';

import Modal from '../Modal';
import Input from '../Input';
import Select from '../Select';

import getValidationErros from '../../utils/getValidationErros';
import Tabs from '../Tabs';
import Tab from '../Tab';
import { priceToNumber } from '../../utils/numberFormat';
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

interface IRetencaoDTO {
  tipo_contato_id: number;
  valor_financiado: number;
  valor_primeira_parcela: number;
  observacao: string;
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

const ModalRetentionContract: React.FC<IModalProps> = ({
  negotiation,
  tipoContatoOptions,
  refreshPage,
}) => {
  const formRef = useRef<FormHandles>(null);
  const {
    retentionContract,
    showModalRetentionContract,
    toggleModalRetentionContract,
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
        valor_financiado: Yup.string().required('Valor financiado obrigatório'),
        tipo_contato_id: Yup.string().required('Tipo de contato é obrigatório'),
      });

      await schema.validate(data, { abortEarly: false });

      const finValue = priceToNumber(data?.valor_financiado.toString());
      if (finValue < Number(negotiation.valor_venda)) {
        formRef.current?.setErrors({
          valor_financiado: `Valor financiado não pode ser menor que o valor do contrato: ${negotiation.valor_venda_formatted}`,
        });
        return;
      }

      const firstPayment = priceToNumber(
        data?.valor_primeira_parcela.toString(),
      );
      if (firstPayment > 0) {
        if (firstPayment > Number(negotiation.valor_venda)) {
          formRef.current?.setErrors({
            valor_primeira_parcela: `1ª parcela não pode ser maior que o valor do contrato: ${negotiation.valor_venda_formatted}`,
          });
          return;
        }
      }
      setShowModalConfirm(!showModalConfirm);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErros(err);
        formRef.current?.setErrors(errors);
      }
    }
  }, [showModalConfirm, negotiation]);

  const handleModalConfirmYes = useCallback(() => {
    toggleModalConfirm();
    setLoadingModal(true);
    formRef.current?.submitForm();
  }, [toggleModalConfirm]);

  const handleSubmit = useCallback(
    async (data: IRetencaoDTO) => {
      try {
        await retentionContract(data, negotiation.id);

        setLoadingModal(false);
        toggleModalRetentionContract();
        refreshPage();
        addToast({
          type: 'success',
          title: 'Negociação Finalizada!',
          description: `Retenção de contrato`,
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
    [
      retentionContract,
      refreshPage,
      toggleModalRetentionContract,
      addToast,
      negotiation.id,
    ],
  );

  return (
    <Modal
      isOpen={showModalRetentionContract}
      setIsOpen={toggleModalRetentionContract}
      width="912px"
    >
      <ModalConfirm
        title="Retenção de Contrato"
        message={`Confirma RETENÇÃO do contrato ${negotiation.numeroprojeto}-${negotiation.numerocontrato}?`}
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
        <h1>Finalização de Negociação | Retenção Contrato</h1>
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
                  name="valor_financiado"
                  placeholder="Valor Financiado"
                  mask="currency"
                  defaultValue={negotiation.valor_venda_formatted}
                />
                <Input
                  name="valor_primeira_parcela"
                  placeholder="Valor 1ª Parcela"
                  mask="currency"
                />
              </div>

              <button
                type="button"
                data-testid="add-food-button"
                onClick={toggleModalConfirm}
              >
                <p className="text">Finalizar Retenção</p>
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

export default ModalRetentionContract;
