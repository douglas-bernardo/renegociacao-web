import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { api } from '../../../services/api';
import { numberFormat } from '../../../utils/numberFormat';

import { Container } from '../styles/styles';

interface Report {
  usuario_id: number;
  ano_sol: number;
  usuario_resp: string;
  valor_solicitado: number;
  valor_solicitado_formatted: string;
  valor_em_aberto: number;
  valor_em_aberto_formatted: string;
  percentual: string;
}

interface RequestReport {
  status: string;
  data: Report[];
}

interface OpenPercentageProps {
  year: number;
}

const OpenPercentage: React.FC<OpenPercentageProps> = ({ year }) => {
  const [openPercentage, setOpenPercentage] = useState<Report[]>([]);

  useEffect(() => {
    api
      .get<RequestReport>('/reports/admin/open-percentage', {
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
            valor_em_aberto_formatted: numberFormat(
              report.valor_em_aberto ?? 0,
            ),
          };
        });
        setOpenPercentage(reportFormatted);
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
            <th>Negociador(a)</th>
            <th>Valor Solicitado</th>
            <th>Valor Em Aberto</th>
            <th>(%) Percentual</th>
          </tr>
        </thead>
        <tbody>
          {openPercentage &&
            openPercentage.map(report => (
              <tr key={uuid()}>
                <td>{report.usuario_resp}</td>
                <td>{report.valor_solicitado_formatted}</td>
                <td>{report.valor_em_aberto_formatted}</td>
                <td>{`${report.percentual ?? '0'}%`}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Container>
  );
};

export default OpenPercentage;
