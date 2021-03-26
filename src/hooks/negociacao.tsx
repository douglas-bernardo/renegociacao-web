import React, { createContext, useCallback, useContext } from 'react';
import { api } from '../services/api';

interface IRetencaoDTO {
  origem_id: number;
  tipo_solicitacao_id: number;
  tipo_contato_id: number;
  motivo_id: number;
  valor_primeira_parcela: number;
  observacao: string;
  valor_financiado: number;
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
  projeto_id: number;
  numerocontrato: number;
  valor_venda: number;
  observacao: string;
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

interface IOutrasFinalizacoesDTO {
  situacao_id: number;
  origem_id: number;
  tipo_solicitacao_id: number;
  tipo_contato_id: number;
  motivo_id: number;
  observacao: string;
}

interface NegociacaoContextData {
  retencao(data: IRetencaoDTO, id: string): Promise<void>;
  reversao(data: IReversaoDTO, id: string): Promise<void>;
  cancelamento(data: ICancelamentoDTO, id: string): Promise<void>;
  outrasFinalizacoes(data: IOutrasFinalizacoesDTO, id: string): Promise<void>;
}

export const NegociacaoContext = createContext<NegociacaoContextData>(
  {} as NegociacaoContextData,
);

export const NegociacaoProvider: React.FC = ({ children }) => {
  const retencao = useCallback(async (data: IRetencaoDTO, id: string) => {
    const retencaoData = {
      situacao: {
        situacao_id: 6,
      },
      negociacao: {
        origem_id: data.origem_id,
        tipo_solicitacao_id: data.tipo_solicitacao_id,
        tipo_contato_id: data.tipo_contato_id,
        motivo_id: data.motivo_id,
        valor_primeira_parcela: data.valor_primeira_parcela,
        observacao: data.observacao,
      },
      retencao: {
        valor_financiado: data.valor_financiado,
      },
    };

    await api.post(`/ocorrencias/${id}/finaliza-retencao`, retencaoData);
  }, []);

  const reversao = useCallback(async (data: IReversaoDTO, id: string) => {
    const reversaoData = {
      situacao: {
        situacao_id: 7,
      },
      negociacao: {
        origem_id: data.origem_id,
        tipo_solicitacao_id: data.tipo_solicitacao_id,
        tipo_contato_id: data.tipo_contato_id,
        motivo_id: data.motivo_id,
        reembolso: data.reembolso,
        numero_pc: data.numero_pc,
        taxas_extras: data.taxas_extras,
        valor_primeira_parcela: data.valor_primeira_parcela,
        observacao: data.observacao,
      },
      reversao: {
        projeto_id: data.projeto_id,
        numerocontrato: data.numerocontrato,
        valor_venda: data.valor_venda,
      },
    };
    await api.post(`/ocorrencias/${id}/finaliza-reversao`, reversaoData);
  }, []);

  const cancelamento = useCallback(
    async (data: ICancelamentoDTO, id: string) => {
      const cancelamentoData = {
        situacao: {
          situacao_id: 2,
        },
        negociacao: {
          origem_id: data.origem_id,
          tipo_solicitacao_id: data.tipo_solicitacao_id,
          tipo_contato_id: data.tipo_contato_id,
          motivo_id: data.motivo_id,
          reembolso: data.reembolso,
          numero_pc: data.numero_pc,
          taxas_extras: data.taxas_extras,
          observacao: data.observacao,
        },
        cancelamento: {
          multa: data.multa,
        },
      };
      await api.post(
        `/ocorrencias/${id}/finaliza-cancelamento`,
        cancelamentoData,
      );
    },
    [],
  );

  const outrasFinalizacoes = useCallback(
    async (data: IOutrasFinalizacoesDTO, id: string) => {
      const outros = {
        situacao: {
          situacao_id: data.situacao_id,
        },
        negociacao: {
          origem_id: data.origem_id,
          tipo_solicitacao_id: data.tipo_solicitacao_id,
          tipo_contato_id: data.tipo_contato_id,
          motivo_id: data.motivo_id,
          observacao: data.observacao,
        },
      };
      await api.post(`/ocorrencias/${id}/finaliza-padrao`, outros);
    },
    [],
  );

  return (
    <NegociacaoContext.Provider
      value={{ retencao, reversao, cancelamento, outrasFinalizacoes }}
    >
      {children}
    </NegociacaoContext.Provider>
  );
};

export function useNegociacao(): NegociacaoContextData {
  const context = useContext(NegociacaoContext);

  if (!context) {
    throw new Error('useNegociacao must be used within an NegociacaoProvider');
  }
  return context;
}
