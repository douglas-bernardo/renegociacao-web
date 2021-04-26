import React, { useRef, useCallback, useEffect, useState } from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import { FormHandles } from '@unform/core';

import * as Yup from 'yup';
import { api } from '../../services/api';

import { Container, Form } from './styles';
import { Card, CardBody, CardHeader } from '../Container';

import { useNegociacao } from '../../hooks/negociacao';
import { useToast } from '../../hooks/toast';

import Modal from '../Modal';
import Input from '../Input';
import Select from '../Select';

import getValidationErros from '../../utils/getValidationErros';
import { numberFormat } from '../../utils/numberFormat';
import Tabs from '../Tabs';
import Tab from '../Tab';

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
  projeto_id: number;
  numerocontrato: number;
  valor_venda: number;
  observacao: string;
}

interface IModalProps {
  ocorrencia_id: string;
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

interface TipoContato {
  id: number;
  nome: string;
}

interface Produto {
  id: number;
  numeroprojeto: number;
  nomeprojeto: string;
}

interface Contrato {
  nome_cliente: string;
  numeroprojeto: number;
  numerocontrato: number;
  valor_venda: string;
  valorVendaFormatted: string;
  produto: string;
}

const ModalReversao: React.FC<IModalProps> = ({
  ocorrencia_id,
  refreshPage,
}) => {
  const formRef = useRef<FormHandles>(null);
  const { reversao, showModalReversao, toggleModalReversao } = useNegociacao();
  const { addToast } = useToast();

  const [motivoOptions, setMotivoOptions] = useState<Motivo[]>([]);
  const [tipoSolOptions, setTipoSolOptions] = useState<TipoSol[]>([]);
  const [origemOptions, setOrigemOptions] = useState<Origem[]>([]);
  const [tipoContatoOptions, setTipoContatoOptions] = useState<TipoContato[]>(
    [],
  );
  const [produtoOptions, setProdutoOptions] = useState<Produto[]>([]);
  const [contrato, setContrato] = useState<Contrato>({} as Contrato);

  useEffect(() => {
    Promise.all([
      api.get(`/domain/reasons`),
      api.get(`/dominio/tipo-solicitacao`),
      api.get(`/dominio/origem`),
      api.get(`/dominio/tipo-contato`),
      api.get(`/dominio/projeto`),
      api.get(`ocorrencias/${ocorrencia_id}`),
    ])
      .then(response => {
        const [
          motivos,
          tiposSol,
          origem,
          tipoContato,
          produto,
          contratoDetalhe,
        ] = response;

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

        const { data: produtoResponse } = produto.data;
        setProdutoOptions(
          produtoResponse.map((opt: Produto) => {
            return {
              value: opt.id,
              label: `${opt.numeroprojeto} - ${opt.nomeprojeto}`,
            };
          }),
        );

        const { data: contratoResponse } = contratoDetalhe.data;
        if (!contratoResponse) return;
        setContrato({
          ...contratoResponse,
          valorVendaFormatted: numberFormat(contratoResponse.valor_venda),
        });
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  }, [ocorrencia_id]);

  const handleSubmit = useCallback(
    async (data: IReversaoDTO) => {
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
          projeto_id: Yup.string().required('Produto é obrigatório'),
          numerocontrato: Yup.string().required(
            'Número Contrato é obrigatório',
          ),
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
        await reversao(data, ocorrencia_id);

        toggleModalReversao();
        refreshPage();

        addToast({
          type: 'success',
          title: 'Ocorrência Finalizada!',
          description: 'Reversão de Contrato',
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
    [reversao, toggleModalReversao, refreshPage, addToast, ocorrencia_id],
  );

  return (
    <Modal
      isOpen={showModalReversao}
      setIsOpen={toggleModalReversao}
      width="912px"
    >
      <Container>
        <h1>Finalização de Negociação | Reversão Contrato</h1>
        <Tabs>
          <Tab title="Dados">
            <Form ref={formRef} onSubmit={handleSubmit}>
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
                name="projeto_id"
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
                  placeholder="Taxas e Multas Extras"
                  mask="currency"
                />
                <Input
                  name="valor_primeira_parcela"
                  placeholder="Valor 1ª Parcela"
                  mask="currency"
                />
              </div>
              <Input name="observacao" placeholder="Observações" />
              <button type="submit" data-testid="add-food-button">
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
                  <div>{contrato.nome_cliente}</div>
                </div>
                <div className="row">
                  <span>Contrato:</span>
                  <div>
                    {`${contrato.numeroprojeto}-${contrato.numerocontrato}`}
                  </div>
                </div>
                <div className="row">
                  <span>Valor de Venda:</span>
                  <div>{contrato.valorVendaFormatted}</div>
                </div>
                <div className="row">
                  <span>Produto:</span>
                  <div>{contrato.produto}</div>
                </div>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </Container>
    </Modal>
  );
};

export default ModalReversao;
