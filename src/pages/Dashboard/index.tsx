import React, { useCallback, useEffect, useState } from 'react';
import Select, { components } from 'react-select';
import { AiOutlineCalendar } from 'react-icons/ai';

import { Container, Content } from '../../components/Container';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import QCOFollowUpMonthlyRequests from '../../components/Reports/QCOFollowUpMonthlyRequests';
import QCOFollowUpMonthlyRequestsSevenDays from '../../components/Reports/QCOFollowUpMonthlyRequestsSevenDays';
import QCOFollowUpAccumulatedProfit from '../../components/Reports/QCOFollowUpAccumulatedProfit';

import {
  Main,
  MainHeader,
  CardsContainer,
  DataCard,
  QCOFollowUpContainer,
} from './styles';

import MonthlyEfficiencyChart from '../../components/Charts/MonthlyEfficiencyChart';
import AmountReceivedChart from '../../components/Charts/AmountReceivedChart';

import money from '../../assets/money.svg';
import chartMoneyUp from '../../assets/chart-money-up.svg';
import chartMoneyDown from '../../assets/chart-money-down.svg';
import bagMoney from '../../assets/bag-money.svg';
import { api } from '../../services/api';
import { numberFormat } from '../../utils/numberFormat';

const yearResultsToShow = [{ value: 2021, label: '2021' }];

const selectCustomStyles = {
  container: base => ({
    ...base,
    width: '100px',
    border: 'none',
    boxShadow: 'none',
  }),
  menu: provided => ({
    ...provided,
    border: 'none',
    boxShadow: 'none',
  }),
  theme: theme => ({
    ...theme,
    border: 'none',
  }),
};

interface Report {
  cycle_start: string;
  request_amount: number;
  request_amountFormatted: string;
  profit: number;
  profitFormatted: string;
  financial_loss_amount: number;
  financial_loss_amountFormatted: string;
  balance: number;
  balanceFormatted: string;
}

interface RequestReport {
  status: string;
  data: Report[];
}

interface Summary {
  request_amount: number;
  profit: number;
  financial_loss_amount: number;
  balance: number;
}

interface SummaryFormatted {
  request_amount: string;
  profit: string;
  financial_loss_amount: string;
  balance: string;
}

const Dashboard: React.FC = () => {
  const [
    monthlyRequestsSummary,
    setMonthlyRequestsSummary,
  ] = useState<SummaryFormatted>({} as SummaryFormatted);

  useEffect(() => {
    api
      .get<RequestReport>('/reports/monthly-requests-summary', {
        params: {
          year: 2021,
        },
      })
      .then(response => {
        const { data } = response.data;
        const summary = data.reduce(
          (accumulator: Summary, report: Report) => {
            accumulator.request_amount += Number(report.request_amount);
            accumulator.profit += Number(report.profit);
            accumulator.financial_loss_amount += Number(
              report.financial_loss_amount,
            );
            accumulator.balance += Number(report.balance);
            return accumulator;
          },
          {
            request_amount: 0,
            profit: 0,
            financial_loss_amount: 0,
            balance: 0,
          },
        );

        const result = {
          request_amount: numberFormat(summary.request_amount),
          profit: numberFormat(summary.profit),
          financial_loss_amount: numberFormat(summary.financial_loss_amount),
          balance: numberFormat(summary.balance),
        };

        setMonthlyRequestsSummary(result);
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }, []);

  const handleSelectResultsToShow = useCallback(() => {
    console.log('Changing results...');
  }, []);

  const DropdownIndicator = props => {
    return (
      <components.DropdownIndicator {...props}>
        <AiOutlineCalendar />
      </components.DropdownIndicator>
    );
  };

  return (
    <Container>
      <Sidebar />
      <Content>
        <Header />
        <Main>
          <MainHeader>
            <p>Exibindo resultados de:</p>
            <Select
              onChange={handleSelectResultsToShow}
              menuPlacement="auto"
              options={yearResultsToShow}
              defaultValue={yearResultsToShow[0]}
              styles={selectCustomStyles}
              components={{ DropdownIndicator }}
            />
          </MainHeader>

          <CardsContainer>
            <DataCard>
              <img className="data-card-logo" src={money} alt="logo" />
              <div className="data-card-content">
                <small>Valor Solicitado</small>
                <h2>{monthlyRequestsSummary.request_amount}</h2>
              </div>
            </DataCard>
            <DataCard>
              <img className="data-card-logo" src={chartMoneyUp} alt="logo" />
              <div className="data-card-content">
                <small>Faturamento</small>
                <h2>{monthlyRequestsSummary.profit}</h2>
              </div>
            </DataCard>
            <DataCard>
              <img className="data-card-logo" src={chartMoneyDown} alt="logo" />
              <div className="data-card-content">
                <small>Perda Financeira</small>
                <h2>{monthlyRequestsSummary.financial_loss_amount}</h2>
              </div>
            </DataCard>
            <DataCard>
              <img className="data-card-logo" src={bagMoney} alt="logo" />
              <div className="data-card-content">
                <small>Caixa</small>
                <h2>{monthlyRequestsSummary.balance}</h2>
              </div>
            </DataCard>
          </CardsContainer>

          <div className="horizontalRowChart">
            <MonthlyEfficiencyChart />
            <AmountReceivedChart />
          </div>

          <QCOFollowUpContainer>
            <QCOFollowUpMonthlyRequests year={2021} />
            <QCOFollowUpMonthlyRequestsSevenDays year={2021} />
            <QCOFollowUpAccumulatedProfit year={2021} />
          </QCOFollowUpContainer>
        </Main>
      </Content>
    </Container>
  );
};

export default Dashboard;
