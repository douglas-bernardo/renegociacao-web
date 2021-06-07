import React, { useEffect, useState } from 'react';
import Chart, { Props } from 'react-apexcharts';
import { api } from '../../../services/api';

import { Container } from './styles';

const ChartOption = {
  chart: {
    type: 'donut',
  },
  title: {
    text: 'Situação - Valor Recebido',
    align: 'left',
    margin: 0,
  },
  labels: [],
  legend: {
    show: false,
  },
  plotOptions: {
    pie: {
      donut: {
        size: '60%',
        labels: {
          show: true,
        },
      },
    },
  },
  noData: {
    text: 'Sem Dados',
  },
} as Props;

interface Amount {
  description: string;
  total: number;
}

interface AmountReceivedChartProps {
  year: number;
}

const AmountReceivedChart: React.FC<AmountReceivedChartProps> = ({ year }) => {
  const [series, setSeries] = useState<any[] | undefined>([]);
  const [options, setOptions] = useState({});

  useEffect(() => {
    api
      .get('/reports/amount-received', {
        params: {
          year,
        },
      })
      .then(response => {
        const { data } = response.data;
        const labels: string[] = [];

        let sum = 0;
        data.forEach((element: Amount) => {
          sum += Number(element.total);
          labels.push(element.description);
        });

        const perc = data.map((e: Amount) => {
          return Number(((Number(e.total) / sum) * 100).toFixed(1));
        });

        setSeries(Object.values(perc));
        setOptions({
          ...ChartOption,
          labels: Object.values(labels),
        });
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }, [year]);

  return (
    <Container>
      <Chart options={options} series={series} type="donut" height="100%" />
    </Container>
  );
};

export default AmountReceivedChart;
