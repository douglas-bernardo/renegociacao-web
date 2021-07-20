import React, { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { numberFormat } from '../../../utils/numberFormat';

import { Container } from '../styles/styles';

interface Report {
  ano_sol: number;
  usuario_resp: string;
  valor_solicitado: number;
  valor_solicitado_formatted: string;
  valor_em_aberto: number;
  valor_em_aberto_formatted: string;
  percentual: number;
}

interface RequestReport {
  status: string;
  data: Report[];
}

interface QCOPercentageOpenProps {
  year: number;
}

const QCOPercentageOpen: React.FC<QCOPercentageOpenProps> = ({ year }) => {
  const [percentageOpen, setPercentageOpen] = useState<Report[]>([]);

  useEffect(() => {
    api
      .get<RequestReport>('/reports/open-percentage', {
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
            valor_em_aberto_formatted: numberFormat(report.valor_em_aberto),
          };
        });
        setPercentageOpen(reportFormatted);
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }, [year]);

  return (
    <Container>
      <header>
        <h3>Percentual Em Aberto</h3>
      </header>
      <table>
        <thead>
          <tr>
            <th>Negociadora</th>
            <th>Valor Solicitado</th>
            <th>Valor Em Aberto</th>
            <th>Percentual Em Aberto</th>
          </tr>
        </thead>
        <tbody>
          {percentageOpen &&
            percentageOpen.map(report => (
              <tr key={report.ano_sol}>
                <td>{report.usuario_resp}</td>
                <td>{report.valor_solicitado_formatted}</td>
                <td>
                  {report.valor_em_aberto_formatted.length > 0
                    ? report.valor_em_aberto_formatted
                    : '0,00'}
                </td>
                <td>{`${report.percentual ? report.percentual : '0.00'}%`}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Container>
  );
};

export default QCOPercentageOpen;
