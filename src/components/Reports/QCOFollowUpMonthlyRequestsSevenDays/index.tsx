import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { numberFormat } from '../../../utils/numberFormat';

import { Container } from '../styles/styles';

interface Report {
  cycle_end: string;
  negotiator_name: string;
  request_value: number;
  request_valueFormatted: string;
  profit: number;
  profitFormatted: string;
  efficiency: number;
}

interface RequestReport {
  status: string;
  data: Report[];
}

interface QCOFollowUpMonthlyRequestsSevenDaysProps {
  year: number;
}

const QCOFollowUpMonthlyRequestsSevenDays: React.FC<QCOFollowUpMonthlyRequestsSevenDaysProps> = ({
  year,
}) => {
  const [monthlyRequestsSevenDays, setMonthlyRequestsSevenDays] = useState<
    Report[]
  >([]);

  useEffect(() => {
    api
      .get<RequestReport>('/reports/monthly-requests-seven-days', {
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
          };
        });
        setMonthlyRequestsSevenDays(reportFormatted);
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }, [year]);

  return (
    <Container>
      <header>
        <h3>Solicitação de Cancelamento Mensal 7 Dias</h3>
      </header>
      <table>
        <thead>
          <tr>
            <th>Ciclo Finalização</th>
            <th>Valor Solicitado</th>
            <th>Faturamento</th>
            <th>% Eficiência</th>
          </tr>
        </thead>
        <tbody>
          {monthlyRequestsSevenDays &&
            monthlyRequestsSevenDays.map(report => (
              <tr key={report.cycle_end}>
                <td>{report.cycle_end}</td>
                <td>{report.request_valueFormatted}</td>
                <td>{report.profitFormatted}</td>
                <td>{`${report.efficiency}%`}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Container>
  );
};

export default QCOFollowUpMonthlyRequestsSevenDays;
