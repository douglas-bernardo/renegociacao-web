import React, { useRef, useCallback, useEffect, useState } from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';

import * as Yup from 'yup';

import { api } from '../../services/api';
import { Container, Form } from './styles';

import { useNegotiation } from '../../hooks/negotiation';
import { useToast } from '../../hooks/toast';

import Modal from '../Modal';
import Input from '../Input';
import Select from '../Select';

import getValidationErros from '../../utils/getValidationErros';
import Tabs from '../Tabs';
import Tab from '../Tab';
import { Card, CardBody, CardHeader } from '../Container';

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

interface IModalProps {
  negotiation: Negotiation;
  refreshPage: () => void;
}

interface ContactType {
  id: number;
  nome: string;
}

const ModalCancelContract: React.FC<IModalProps> = ({
  negotiation,
  refreshPage,
}) => {
  const formRef = useRef<FormHandles>(null);
  const {
    cancelContract,
    showModalCancelContract,
    toggleModalCancelContract,
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
    async (data: ICancelamentoDTO) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          tipo_contato_id: Yup.string().required(
            'Tipo de contato é obrigatório',
          ),
          numero_pc: Yup.string().when('reembolso', {
            is: (value: string) => value && value.length > 0,
            then: Yup.string().required(
              'Número do PC é obrigatório quando há reembolso',
            ),
            otherwise: Yup.string(),
          }),
        });

        await schema.validate(data, { abortEarly: false });
        await cancelContract(data, negotiation.id);

        toggleModalCancelContract();
        refreshPage();
        addToast({
          type: 'success',
          title: 'Negociação Finalizada!',
          description: 'Cancelamento de Contrato',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErros(err);
          formRef.current?.setErrors(errors);
          return;
        }
        toggleModalCancelContract();
        console.log(err);
        addToast({
          type: 'error',
          title: err.message,
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
                  placeholder="Taxas e Multas Extras"
                  mask="currency"
                />
              </div>
              <Input name="observacao" placeholder="Observações" />
              <button type="submit" data-testid="add-food-button">
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
