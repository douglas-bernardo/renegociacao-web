import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';

import { api } from '../../../services/api';

import { Container, ContainerLoading } from './styles';
import { numberFormat } from '../../../utils/numberFormat';

const ChartOption = {
  chart: {
    height: 350,
    type: 'area',
    toolbar: {
      show: false,
    },
  },
  colors: ['#449DD1', '#F9A3A4'],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'smooth',
  },
  title: {
    text: 'Valor Recebido x Valor Em Aberto',
  },
  noData: {
    text: 'Sem Dados',
  },
  yaxis: [
    {
      labels: {
        formatter: value => {
          return numberFormat(value);
        },
      },
    },
  ],
} as ApexOptions;

interface Report {
  usuario_resp: string;
  valor_solicitado: number;
  valor_em_aberto: number;
  percentual: number;
}

interface ReportResponse {
  status: string;
  data: Report[];
}

interface OpenPercentageAdminProps {
  year: number;
}

const OpenPercentageAdmin: React.FC<OpenPercentageAdminProps> = ({ year }) => {
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState<any[] | undefined>([]);
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    api
      .get<ReportResponse>('/reports/admin/open-percentage', {
        params: {
          year,
        },
      })
      .then(response => {
        const { data } = response.data;
        const amountPaid: number[] = [];
        const unpaidAmount: number[] = [];
        const percent: number[] = [];
        const labelsXAxis: string[] = [];

        data.forEach(row => {
          amountPaid.push(row.valor_solicitado);
          unpaidAmount.push(row.valor_em_aberto);
          percent.push(row.percentual);
          labelsXAxis.push(row.usuario_resp);
        });

        const seriesData = [
          {
            name: 'Valor Recebido',
            data: amountPaid,
          },
          {
            name: 'Valor Em Aberto',
            data: unpaidAmount,
          },
        ];

        setSeries(seriesData);
        setChartOptions({
          ...ChartOption,
          xaxis: {
            type: 'category',
            categories: labelsXAxis,
          },
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
          type="area"
          height={260}
        />
      )}
    </Container>
  );
};

export default OpenPercentageAdmin;
