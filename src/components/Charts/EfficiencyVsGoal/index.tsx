import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';

import { api } from '../../../services/api';
import { Container, ContainerLoading } from './styles';

const ChartOptions = {
  chart: {
    height: 350,
    type: 'line',
    toolbar: {
      show: false,
    },
  },
  stroke: {
    width: [0, 4],
  },
  title: {
    text: 'Eficiência x Meta Mensal',
  },
  dataLabels: {
    enabled: true,
    enabledOnSeries: [0],
    formatter: value => {
      return `${value}%`;
    },
  },
  xaxis: {
    type: 'category',
  },
  yaxis: [
    {
      title: {
        text: 'Eficiência',
      },
      labels: {
        formatter: value => {
          return `${value}%`;
        },
      },
    },
    {
      opposite: true,
      title: {
        text: 'Meta',
      },
      labels: {
        formatter: value => {
          return `${value}%`;
        },
      },
    },
  ],
} as ApexOptions;

interface Report {
  ano_sol: number;
  negociador: string;
  ocorrencias_recebidas: number;
  valor_solicitado: number;
  valor_faturamento: number;
  valor_perda_financeira: number;
  eficiencia_percentual: number;
  perda_financeira_percentual: number;
  meta: number;
}

interface ReportResponse {
  status: string;
  data: Report[];
}

interface MonthlyEfficiencyChartProps {
  year: number;
}

const EfficiencyVsGoal: React.FC<MonthlyEfficiencyChartProps> = ({ year }) => {
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState<any[] | undefined>([]);
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    api
      .get<ReportResponse>('/reports/admin/accumulated-efficiency', {
        params: {
          year,
        },
      })
      .then(response => {
        const { data } = response.data;
        const goal: number[] = [];
        const efficiency: number[] = [];
        const labels: string[] = [];

        data.forEach(row => {
          goal.push(row.meta);
          efficiency.push(row.eficiencia_percentual);
          labels.push(row.negociador);
        });

        const seriesData = [
          {
            name: 'Eficiência',
            type: 'column',
            data: efficiency,
          },
          {
            name: 'Meta',
            type: 'line',
            data: goal,
          },
        ];
        setSeries(seriesData);
        setChartOptions({
          ...ChartOptions,
          labels,
        });
        setLoading(false);
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }, [year]);

  return (
    <Container>
      {loading ? (
        <ContainerLoading>
          <Loader type="ThreeDots" color="#003379" height={30} width={30} />
        </ContainerLoading>
      ) : (
        <Chart
          options={chartOptions}
          series={series}
          type="line"
          height={350}
        />
      )}
    </Container>
  );
};

export default EfficiencyVsGoal;
