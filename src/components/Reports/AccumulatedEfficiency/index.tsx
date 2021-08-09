import React, { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';

import { api } from '../../../services/api';
import { numberFormat } from '../../../utils/numberFormat';

import { Container } from '../styles/styles';

interface Report {
  negociador: string;
  ocorrencias_recebidas: number;
  valor_solicitado: number;
  valor_solicitado_formatted: string;
  valor_faturamento: number;
  valor_faturamento_formatted: string;
  valor_perda_financeira: number;
  valor_perda_financeira_formatted: string;
  eficiencia_percentual: string;
  perda_financeira_percentual: string;
}

interface RequestReport {
  status: string;
  data: Report[];
}

interface AccumulatedEfficiencyProps {
  year: number;
}

const AccumulatedEfficiency: React.FC<AccumulatedEfficiencyProps> = ({
  year,
}) => {
  const [accumulatedEfficiency, setAccumulatedEfficiency] = useState<Report[]>(
    [],
  );

  useEffect(() => {
    api
      .get<RequestReport>('/reports/admin/accumulated-efficiency', {
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
            valor_faturamento_formatted: numberFormat(report.valor_faturamento),
            valor_perda_financeira_formatted: numberFormat(
              report.valor_perda_financeira,
            ),
          };
        });
        setAccumulatedEfficiency(reportFormatted);
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }, [year]);

  return (
    <Container>
      <header>
        <h3>Eficiência Acumulada</h3>
      </header>
      <table>
        <thead>
          <tr>
            <th>Negociador(a)</th>
            <th>Ocorrências Recebidas</th>
            <th>Valor Solicitado</th>
            <th>Faturamento</th>
            <th>Perda Financeira</th>
            <th>(%) Eficiência</th>
            <th>(%) Perda Financeira</th>
          </tr>
        </thead>
        <tbody>
          {accumulatedEfficiency &&
            accumulatedEfficiency.map(report => (
              <tr key={uuid()}>
                <td>{report.negociador}</td>
                <td>{report.ocorrencias_recebidas}</td>
                <td>{report.valor_solicitado_formatted}</td>
                <td>{report.valor_faturamento_formatted}</td>
                <td>{report.valor_perda_financeira_formatted}</td>
                <td>{`${report.eficiencia_percentual}%`}</td>
                <td>{`${report.perda_financeira_percentual}%`}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Container>
  );
};

export default AccumulatedEfficiency;
