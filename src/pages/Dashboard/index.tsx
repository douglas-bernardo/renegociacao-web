import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import QCOPercentageOpen from '../../components/Reports/QCOPercentageOpen';

const selectCustomStyles = {
  container: base => ({
    ...base,
    width: 130,
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

interface Options {
  value: number;
  label: string;
}

const Dashboard: React.FC = () => {
  const [
    monthlyRequestsSummary,
    setMonthlyRequestsSummary,
  ] = useState<SummaryFormatted>({} as SummaryFormatted);

  const [yearResults, setYearResults] = useState(() => {
    return new Date().getFullYear();
  });

  useEffect(() => {
    api
      .get<RequestReport>('/reports/monthly-requests-summary', {
        params: {
          year: yearResults,
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
  }, [yearResults]);

  const yearsResultOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const listYears = Array.from(new Array(3), (v, idx) => currentYear - idx);
    const options: Options[] = listYears.map(year => {
      return { value: year, label: year.toString() };
    });
    return options;
  }, []);

  const handleSelectYearsResultsToShow = useCallback((selected: any) => {
    setYearResults(selected.value);
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
              menuPlacement="auto"
              styles={selectCustomStyles}
              options={yearsResultOptions}
              defaultValue={yearsResultOptions[0]}
              components={{ DropdownIndicator }}
              onChange={handleSelectYearsResultsToShow}
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
            <MonthlyEfficiencyChart year={yearResults} />
            <AmountReceivedChart year={yearResults} />
          </div>

          <QCOFollowUpContainer>
            <QCOFollowUpMonthlyRequests year={yearResults} />
            <QCOFollowUpMonthlyRequestsSevenDays year={yearResults} />
            <QCOFollowUpAccumulatedProfit year={yearResults} />
            <QCOPercentageOpen year={yearResults} />
          </QCOFollowUpContainer>
        </Main>
      </Content>
    </Container>
  );
};

export default Dashboard;
