import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { numberFormat } from '../../../utils/numberFormat';

import { Container } from '../styles/styles';

interface Report {
  cycle_end: string;
  negotiator_name: string;
  request_amount: number;
  request_amountFormatted: string;
  kept_amount: number;
  kept_amountFormatted: string;
  new_contract_value: number;
  new_contract_valueFormatted: string;
  financial_loss_amount: number;
  financial_loss_amountFormatted: string;
  extra_rate: number;
  extra_rateFormatted: string;
  fine: number;
  fineFormatted: string;
  refund: number;
  refundFormatted: string;
}

interface RequestReport {
  status: string;
  data: Report[];
}

interface QCOFollowUpAccumulatedProfitProps {
  year: number;
}

const QCOFollowUpAccumulatedProfit: React.FC<QCOFollowUpAccumulatedProfitProps> = ({
  year,
}) => {
  const [accumulatedProfit, setAccumulatedProfit] = useState<Report[]>([]);

  useEffect(() => {
    api
      .get<RequestReport>('/reports/accumulated-profit', {
        params: {
          year,
        },
      })
      .then(response => {
        const { data } = response.data;

        const reportFormatted = data.map(report => {
          return {
            ...report,
            request_amountFormatted: numberFormat(report.request_amount),
            kept_amountFormatted: numberFormat(report.kept_amount),
            new_contract_valueFormatted: numberFormat(
              report.new_contract_value,
            ),
            financial_loss_amountFormatted: numberFormat(
              report.financial_loss_amount,
            ),
            extra_rateFormatted: numberFormat(report.extra_rate),
            fineFormatted: numberFormat(report.fine),
            refundFormatted: numberFormat(report.refund),
          };
        });
        setAccumulatedProfit(reportFormatted);
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }, [year]);

  return (
    <Container>
      <header>
        <h3>Faturamento Acumulado</h3>
      </header>
      <table>
        <thead>
          <tr>
            <th>Ciclo Finalização</th>
            <th>Valor Solicitado</th>
            <th>Retenção</th>
            <th>Reversão</th>
            <th>Perda</th>
            <th>Taxas</th>
            <th>Multa</th>
            <th>Reembolso</th>
          </tr>
        </thead>
        <tbody>
          {accumulatedProfit &&
            accumulatedProfit.map(report => (
              <tr key={report.cycle_end}>
                <td>{report.cycle_end}</td>
                <td>{report.request_amountFormatted}</td>
                <td>{report.kept_amountFormatted}</td>
                <td>{report.new_contract_valueFormatted}</td>
                <td>{report.financial_loss_amountFormatted}</td>
                <td>{report.extra_rateFormatted}</td>
                <td>{report.fineFormatted}</td>
                <td>{report.refundFormatted}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Container>
  );
};

export default QCOFollowUpAccumulatedProfit;
