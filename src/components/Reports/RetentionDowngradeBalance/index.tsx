import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { api } from '../../../services/api';
import { numberFormat } from '../../../utils/numberFormat';

import { Container } from '../styles/styles';

interface Report {
  negociadora: string;
  valor_solicitado: number;
  valor_solicitado_formatted: string;
  valor_retido: number;
  valor_retido_formatted: string;
  caixa_retencao: number;
  caixa_retencao_formatted: string;
  valor_revertido: number;
  valor_revertido_formatted: string;
  caixa_reversao: number;
  caixa_reversao_formatted: string;
}

interface RequestReport {
  status: string;
  data: Report[];
}

interface RetentionDowngradeBalanceProps {
  year: number;
}

const RetentionDowngradeBalance: React.FC<RetentionDowngradeBalanceProps> = ({
  year,
}) => {
  const [balance, setBalance] = useState<Report[]>([]);

  useEffect(() => {
    api
      .get<RequestReport>('/reports/admin/retention-downgrade-balance', {
        params: {
          year,
        },
      })
      .then(response => {
        const { data } = response.data;

        const reportFormatted = data.map(report => {
          return {
            ...report,
            valor_solicitado_formatted: numberFormat(report.valor_solicitado),
            valor_retido_formatted: numberFormat(report.valor_retido ?? '0'),
            caixa_retencao_formatted: numberFormat(
              report.caixa_retencao ?? '0',
            ),
            valor_revertido_formatted: numberFormat(
              report.valor_revertido ?? '0',
            ),
            caixa_reversao_formatted: numberFormat(
              report.caixa_reversao ?? '0',
            ),
          };
        });
        setBalance(reportFormatted);
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }, [year]);

  return (
    <Container>
      <header>
        <h3>Caixa Retenção/Reversão</h3>
      </header>
      <table>
        <thead>
          <tr>
            <th>Negociador(a)</th>
            <th>Valor Solicitado</th>
            <th>Valor Retido</th>
            <th>Caixa Retenção</th>
            <th>Valor Revertido</th>
            <th>Caixa Reversão</th>
          </tr>
        </thead>
        <tbody>
          {balance &&
            balance.map(report => (
              <tr key={uuid()}>
                <td>{report.negociadora}</td>
                <td>{report.valor_solicitado_formatted}</td>
                <td>{report.valor_retido_formatted}</td>
                <td>{report.caixa_retencao_formatted}</td>
                <td>{report.valor_revertido_formatted}</td>
                <td>{report.caixa_reversao_formatted}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Container>
  );
};

export default RetentionDowngradeBalance;
