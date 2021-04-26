import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';

import { Container } from '../styles/styles';
import { numberFormat } from '../../../utils/numberFormat';

interface Report {
  cycle_start: string;
  negotiator_name: string;
  request_value: number;
  request_valueFormatted: string;
  profit: number;
  profitFormatted: string;
  financial_loss_value: number;
  financial_loss_valueFormatted: string;
  efficiency: number;
  financial_loss: number;
}

interface RequestReport {
  status: string;
  data: Report[];
}

interface QCOFollowUpMonthlyRequests {
  year: number;
}

const QCOFollowUpMonthlyRequests: React.FC<QCOFollowUpMonthlyRequests> = ({
  year,
}) => {
  const [monthlyRequests, setMonthlyRequests] = useState<Report[]>([]);

  useEffect(() => {
    api
      .get<RequestReport>('/reports/monthly-requests', {
        params: {
          year,
        },
      })
      .then(response => {
        const { data } = response.data;

        const reportFormatted = data.map(report => {
          return {
            ...report,
            request_valueFormatted: numberFormat(report.request_value),
            profitFormatted: numberFormat(report.profit),
            financial_loss_valueFormatted: numberFormat(
              report.financial_loss_value,
            ),
          };
        });
        setMonthlyRequests(reportFormatted);
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }, [year]);

  return (
    <Container>
      <header>
        <h3>Solicitação de Cancelamento Mensal</h3>
      </header>
      <table>
        <thead>
          <tr>
            <th>Ciclo Sol.</th>
            <th>Valor Solicitado</th>
            <th>Faturamento</th>
            <th>Perda Financeira</th>
            <th>% Eficiência</th>
            <th>% Perda</th>
          </tr>
        </thead>
        <tbody>
          {monthlyRequests &&
            monthlyRequests.map(report => (
              <tr key={report.cycle_start}>
                <td>{report.cycle_start}</td>
                <td>{report.request_valueFormatted}</td>
                <td>{report.profitFormatted}</td>
                <td>{report.financial_loss_valueFormatted}</td>
                <td>{`${report.efficiency}%`}</td>
                <td>{`${report.financial_loss}%`}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Container>
  );
};

export default QCOFollowUpMonthlyRequests;
