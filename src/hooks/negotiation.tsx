import React, { createContext, useCallback, useContext, useState } from 'react';
import format from 'date-fns/format';
import { parse } from 'date-fns';

import { api } from '../services/api';

interface IRetentionContractDTO {
  tipo_contato_id: number;
  valor_financiado: number;
  valor_primeira_parcela: number;
  observacao: string;
}

interface IDowngradeContractDTO {
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

interface ICancelContractDTO {
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

interface IDefaultNegotiationCloseDTO {
  situacao_id: number;
  origem_id: number;
  tipo_solicitacao_id: number;
  tipo_contato_id: number;
  motivo_id: number;
  observacao: string;
}

interface INegotiationRegisterDTO {
  origem_id: number;
  tipo_solicitacao_id: number;
  motivo_id: number;
}

interface INegotiationUpdateDTO {
  origem_id: number;
  tipo_solicitacao_id: number;
  motivo_id: number;
  reembolso: number;
  numero_pc: number;
  taxas_extras: number;
  multa: number;
  valor_primeira_parcela: number;
  data_finalizacao: string;
}

interface Options {
  value: string;
  label: string;
}

interface NegotiationContextData {
  showModalRetentionContract: boolean;
  showModalDowngradeContract: boolean;
  showModalCancelContract: boolean;
  showModalDefaultNegotiationClose: boolean;
  showModalNegotiationRegister: boolean;
  optionModalOutrosSelected: Options;
  toggleModalRetentionContract: () => void;
  toggleModalDowngradeContract: () => void;
  toggleModalCancelContract: () => void;
  toggleModalDefaultNegotiationClose: () => void;
  toggleModalNegotiationRegister: () => void;
  toggleModalOutrosSelected: (selected: any) => void;
  retentionContract(data: IRetentionContractDTO, id: number): Promise<void>;
  downgradeContract(data: IDowngradeContractDTO, id: number): Promise<void>;
  cancelContract(data: ICancelContractDTO, id: number): Promise<void>;
  defaultNegotiationClose(
    data: IDefaultNegotiationCloseDTO,
    id: number,
  ): Promise<void>;
  negotiationRegister(data: INegotiationRegisterDTO, id: number): Promise<void>;
  negotiationUpdate(data: INegotiationUpdateDTO, id: number): Promise<void>;
}

export const NegotiationContext = createContext<NegotiationContextData>(
  {} as NegotiationContextData,
);

export const NegotiationProvider: React.FC = ({ children }) => {
  const [showModalRetentionContract, setShowModalRetentionContract] = useState(
    false,
  );

  const [showModalDowngradeContract, setShowModalDowngradeContract] = useState(
    false,
  );

  const [showModalCancelContract, setShowModalCancelContract] = useState(false);

  const [
    showModalDefaultNegotiationClose,
    setShowModalDefaultNegotiationClose,
  ] = useState(false);

  const [
    showModalNegotiationRegister,
    setShowModalNegotiationRegister,
  ] = useState(false);

  const [
    optionModalOutrosSelected,
    setOptionModalOutrosSelected,
  ] = useState<Options>({} as Options);

  const toggleModalRetentionContract = useCallback(() => {
    setShowModalRetentionContract(!showModalRetentionContract);
  }, [showModalRetentionContract]);

  const toggleModalDowngradeContract = useCallback(() => {
    setShowModalDowngradeContract(!showModalDowngradeContract);
  }, [showModalDowngradeContract]);

  const toggleModalCancelContract = useCallback(() => {
    setShowModalCancelContract(!showModalCancelContract);
  }, [showModalCancelContract]);

  const toggleModalOutrosSelected = useCallback(
    (selected: any) => {
      if (selected.value === '16') {
        setShowModalCancelContract(!showModalCancelContract);
      } else {
        setOptionModalOutrosSelected(selected);
        setShowModalDefaultNegotiationClose(!showModalDefaultNegotiationClose);
      }
    },
    [showModalCancelContract, showModalDefaultNegotiationClose],
  );

  const toggleModalDefaultNegotiationClose = useCallback(() => {
    setShowModalDefaultNegotiationClose(!showModalDefaultNegotiationClose);
  }, [showModalDefaultNegotiationClose]);

  const toggleModalNegotiationRegister = useCallback(() => {
    setShowModalNegotiationRegister(!showModalNegotiationRegister);
  }, [showModalNegotiationRegister]);

  const retentionContract = useCallback(
    async (data: IRetentionContractDTO, id: number) => {
      const retentionData = {
        negotiation: {
          situacao_id: 6,
          tipo_contato_id: data.tipo_contato_id,
          valor_primeira_parcela: data.valor_primeira_parcela,
          observacao: data.observacao,
        },
        retention: {
          valor_financiado: data.valor_financiado,
        },
      };
      await api.post(`/negotiations/${id}/retention`, retentionData);
    },
    [],
  );

  const downgradeContract = useCallback(
    async (data: IDowngradeContractDTO, id: number) => {
      const downgradeData = {
        negotiation: {
          situacao_id: 7,
          tipo_contato_id: data.tipo_contato_id,
          reembolso: data.reembolso,
          numero_pc: data.numero_pc,
          taxas_extras: data.taxas_extras,
          valor_primeira_parcela: data.valor_primeira_parcela,
          observacao: data.observacao,
        },
        downgrade: {
          produto_id: data.produto_id,
          numerocontrato: data.numerocontrato,
          valor_venda: data.valor_venda,
        },
      };
      await api.post(`/negotiations/${id}/downgrade-contract`, downgradeData);
    },
    [],
  );

  const cancelContract = useCallback(
    async (data: ICancelContractDTO, id: number) => {
      const cancelData = {
        negotiation: {
          situacao_id: 2,
          tipo_contato_id: data.tipo_contato_id,
          reembolso: data.reembolso,
          numero_pc: data.numero_pc,
          taxas_extras: data.taxas_extras,
          observacao: data.observacao,
        },
        cancel: {
          multa: data.multa,
        },
      };
      await api.post(`/negotiations/${id}/cancel-contract`, cancelData);
    },
    [],
  );

  const defaultNegotiationClose = useCallback(
    async (data: IDefaultNegotiationCloseDTO, id: number) => {
      const defaultCloseData = {
        negotiation: {
          situacao_id: data.situacao_id,
          tipo_contato_id: data.tipo_contato_id,
          observacao: data.observacao,
        },
      };
      await api.post(`/negotiations/${id}/default`, defaultCloseData);
    },
    [],
  );

  const negotiationRegister = useCallback(
    async (data: INegotiationRegisterDTO, id: number) => {
      const negotiation = {
        origem_id: data.origem_id,
        tipo_solicitacao_id: data.tipo_solicitacao_id,
        motivo_id: data.motivo_id,
      };
      await api.post(`/occurrences/${id}/register`, negotiation);
    },
    [],
  );

  const negotiationUpdate = useCallback(
    async (data: INegotiationUpdateDTO, id: number) => {
      const edit = {
        negotiation: {
          origem_id: data.origem_id,
          tipo_solicitacao_id: data.tipo_solicitacao_id,
          motivo_id: data.motivo_id,
          reembolso: data.reembolso,
          numero_pc: data.numero_pc,
          taxas_extras: data.taxas_extras,
          multa: data.multa,
          valor_primeira_parcela: data.valor_primeira_parcela,
          data_finalizacao: data.data_finalizacao
            ? format(
                parse(data.data_finalizacao, 'dd/MM/yyyy', new Date()),
                'yyyy-MM-dd',
              )
            : undefined,
        },
      };
      await api.put(`/negotiations/${id}`, edit);
    },
    [],
  );

  return (
    <NegotiationContext.Provider
      value={{
        showModalRetentionContract,
        showModalDowngradeContract,
        showModalCancelContract,
        showModalDefaultNegotiationClose,
        showModalNegotiationRegister,
        optionModalOutrosSelected,
        toggleModalRetentionContract,
        toggleModalDowngradeContract,
        toggleModalCancelContract,
        toggleModalDefaultNegotiationClose,
        toggleModalNegotiationRegister,
        toggleModalOutrosSelected,
        retentionContract,
        downgradeContract,
        cancelContract,
        defaultNegotiationClose,
        negotiationRegister,
        negotiationUpdate,
      }}
    >
      {children}
    </NegotiationContext.Provider>
  );
};

export function useNegotiation(): NegotiationContextData {
  const context = useContext(NegotiationContext);

  if (!context) {
    throw new Error(
      'useNegotiation must be used within an NegotiationProvider',
    );
  }
  return context;
}
