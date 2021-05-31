import React, { useRef, useCallback, useEffect, useState } from 'react';

import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';

import * as Yup from 'yup';
import { api } from '../../services/api';
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

interface IModalProps {
  negotiation: Negotiation;
  refreshPage: () => void;
}

interface ContactType {
  id: number;
  nome: string;
}

const ModalRetentionContract: React.FC<IModalProps> = ({
  negotiation,
  refreshPage,
}) => {
  const formRef = useRef<FormHandles>(null);
  const {
    retentionContract,
    showModalRetentionContract,
    toggleModalRetentionContract,
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
    async (data: IRetencaoDTO) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          valor_financiado: Yup.string().required(
            'Valor financiado obrigatório',
          ),
          tipo_contato_id: Yup.string().required(
            'Tipo de contato é obrigatório',
          ),
        });

        await schema.validate(data, { abortEarly: false });

        await retentionContract(data, negotiation.id);

        toggleModalRetentionContract();
        refreshPage();
        addToast({
          type: 'success',
          title: 'Negociação Finalizada!',
          description: `Retenção de contrato`,
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

              <button type="submit" data-testid="add-food-button">
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
