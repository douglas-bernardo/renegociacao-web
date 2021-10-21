import { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';

import { api } from '../../../services/api';

import { Container, ContainerLoading } from './styles';

const ChartOptions = {
  chart: {
    type: 'donut',
    height: 'auto',
  },
  title: {
    text: 'Composição Caixa',
    align: 'left',
    margin: 0,
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: '14px',
      fontFamily: 'Helvetica, Arial, sans-serif',
    },
  },
  legend: {
    fontSize: '10px',
    fontFamily: 'Helvetica, Arial',
    position: 'bottom',
  },
  labels: ['Retenção', 'Reversão'],
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        labels: {
          show: true,
        },
      },
    },
  },
} as ApexOptions;

interface Report {
  negociadora: string;
  valor_solicitado: number;
  valor_retido: number;
  caixa_retencao: number;
  caixa_reversao: number;
}

interface ReportResponse {
  status: string;
  data: Report[];
}

interface AmountReceivedChartProps {
  year: number;
}

const BalanceDetails: React.FC<AmountReceivedChartProps> = ({ year }) => {
  const [loading, setLoading] = useState(true);
  const [series, setSeries] = useState<any[] | undefined>([]);

  useEffect(() => {
    api
      .get<ReportResponse>('/reports/admin/retention-downgrade-balance', {
        params: {
          year,
        },
      })
      .then(response => {
        const { data } = response.data;
        const balance = data.reduce(
          (accumulator, item) => {
            accumulator.retencao += Number(item.caixa_retencao);
            accumulator.reversao += Number(item.caixa_reversao);
            accumulator.total +=
              Number(item.caixa_retencao) + Number(item.caixa_reversao);
            return accumulator;
          },
          {
            retencao: 0,
            reversao: 0,
            total: 0,
          },
        );
        setSeries([balance.retencao, balance.reversao]);
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
          options={ChartOptions}
          series={series}
          type="donut"
          height="100%"
        />
      )}
    </Container>
  );
};

export default BalanceDetails;
