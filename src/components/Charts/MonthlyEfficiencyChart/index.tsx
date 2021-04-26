import React, { useEffect, useState } from 'react';
import Chart from 'react-apexcharts';
import { api } from '../../../services/api';

import { Container } from './styles';

interface MonthEfficiency {
  cycle: string;
  efficiency: number;
  financial_loss: number;
}

const ChartOption = {
  chart: {
    type: 'line',
    stacked: false,
    toolbar: {
      show: false,
    },
  },
  colors: ['#77B6EA', '#FF0A54'],
  dataLabels: {
    enabled: false,
    formatter: value => {
      return `${value}%`;
    },
  },
  stroke: {
    curve: 'straight',
  },
  title: {
    text: 'Eficiência x Perda Mensal',
    align: 'left',
  },
  grid: {
    borderColor: '#e7e7e7',
    row: {
      colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
      opacity: 0.5,
    },
  },
  markers: {
    size: 0.5,
  },
  xaxis: {
    type: 'category',
    categories: [],
    labels: {
      hideOverlappingLabels: false,
    },
  },
  yaxis: {
    show: false,
    // labels: {
    //   formatter: value => {
    //     return `${value}%`;
    //   },
    // },
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    offsetY: -30,
  },
  noData: {
    text: 'Loading...',
  },
};

const MonthlyEfficiencyChart: React.FC = () => {
  const [series, setSeries] = useState<any[] | undefined>([]);
  const [options, setOptions] = useState({});

  useEffect(() => {
    api
      .get('/reports/monthly-efficiency', {
        params: {
          year: 2021,
        },
      })
      .then(response => {
        const { data } = response.data;
        const efficiency: number[] = [];
        const financial_loss: number[] = [];
        const monthAxis: string[] = [];

        data.forEach((element: MonthEfficiency) => {
          efficiency.push(Number(element.efficiency));
          financial_loss.push(Number(element.financial_loss));
          monthAxis.push(element.cycle);
        });

        const seriesData = [
          {
            name: 'Eficiência - 2021',
            data: efficiency,
          },
          {
            name: 'Perda Fin. 2021',
            data: financial_loss,
          },
        ];
        setSeries(seriesData);
        setOptions({
          ...ChartOption,
          xaxis: {
            categories: monthAxis,
          },
        });
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }, []);

  return (
    <Container>
      <Chart options={options} series={series} type="line" height={260} />
    </Container>
  );
};

export default MonthlyEfficiencyChart;
