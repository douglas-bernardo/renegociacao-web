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
  produto_id: number;
  numerocontrato: number;
  valor_venda: number;
  observacao: string;
}

interface ContactType {
  id: number;
  nome: string;
}

interface Product {
  id: number;
  numeroprojeto: number;
  nomeprojeto: string;
}

interface IModalProps {
  negotiation: Negotiation;
  tipoContatoOptions: ContactType[];
  produtoOptions: Product[];
  refreshPage: () => void;
}

const ModalDowngradeContract: React.FC<IModalProps> = ({
  negotiation,
  tipoContatoOptions,
  produtoOptions,
  refreshPage,
}) => {
  const formRef = useRef<FormHandles>(null);
  const {
    downgradeContract,
    showModalDowngradeContract,
    toggleModalDowngradeContract,
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
        produto_id: Yup.string().required('Produto é obrigatório'),
        numerocontrato: Yup.string().required('Número Contrato é obrigatório'),
        valor_venda: Yup.string().required('Valor de venda obrigatório'),
        numero_pc: Yup.string().when('reembolso', {
          is: (value: string) => value && value.length > 0,
          then: Yup.string().required(
            'Número do PC é obrigatório quando há reembolso',
          ),
          otherwise: Yup.string(),
        }),
      });

      await schema.validate(data, { abortEarly: false });

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
  }, [
    showModalConfirm,
    negotiation.valor_venda,
    negotiation.valor_venda_formatted,
  ]);

  const handleModalConfirmYes = useCallback(() => {
    toggleModalConfirm();
    setLoadingModal(true);
    formRef.current?.submitForm();
  }, [toggleModalConfirm]);

  const handleSubmit = useCallback(
    async (data: IReversaoDTO) => {
      try {
        await downgradeContract(data, negotiation.id);

        setLoadingModal(false);
        toggleModalDowngradeContract();
        refreshPage();
        addToast({
          type: 'success',
          title: 'Negociação Finalizada!',
          description: 'Reversão de Contrato',
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
      downgradeContract,
      toggleModalDowngradeContract,
      refreshPage,
      addToast,
      negotiation.id,
    ],
  );

  return (
    <Modal
      isOpen={showModalDowngradeContract}
      setIsOpen={toggleModalDowngradeContract}
      width="912px"
    >
      <ModalConfirm
        title="Reversão de Contrato"
        message={`Confirma REVERSÃO do contrato ${negotiation.numeroprojeto}-${negotiation.numerocontrato}?`}
        confirmYes="Confirmar"
        confirmNo="Cancelar"
        isOpen={showModalConfirm}
        setIsOpen={toggleModalConfirm}
        handleConfirmYes={handleModalConfirmYes}
      />
      <LoadingModal isOpen={showLoadingModal} setIsOpen={toggleLoadingModal} />
      <Container>
        <h1>Finalização de Negociação | Reversão Contrato</h1>
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
              <Select
                name="produto_id"
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
                <Input
                  name="reembolso"
                  placeholder="Reembolso"
                  mask="currency"
                />
              </div>
              <div className="row">
                <Input
                  name="numero_pc"
                  placeholder="Número da PC"
                  mask="number"
                />
                <Input
                  name="taxas_extras"
                  placeholder="Taxas Extras"
                  mask="currency"
                />
                <Input
                  name="valor_primeira_parcela"
                  placeholder="Valor 1ª Parcela"
                  mask="currency"
                />
              </div>
              <Input name="observacao" placeholder="Observações" />
              <button
                type="button"
                data-testid="add-food-button"
                onClick={toggleModalConfirm}
              >
                <p className="text">Finalizar Reversão</p>
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

export default ModalDowngradeContract;
