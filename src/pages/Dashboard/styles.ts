import styled from 'styled-components';

export const Main = styled.div`
  height: 100%;
  padding: 30px;
  color: #3c3c3c;
  background: #f7f8fa;

  div.horizontalRowChart {
    display: grid;
    grid-template-columns: 60% 40%;
    gap: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
`;

export const MainHeader = styled.div`
  height: 90px;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;

  p {
    margin-right: 10px;
  }

  svg {
    margin-right: 10px;
  }
`;

export const CardsContainer = styled.div`
  display: flex;
  flex: 1;
  margin-bottom: 10px;
  justify-content: space-between;
`;

export const DataCard = styled.div`
  display: flex;
  width: 250px;
  height: 100px;
  padding: 10px;
  background: #fff;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  border: 1px solid #e6e8eb;

  img.data-card-logo {
    width: 55px;
    height: 55px;
  }

  div.data-card-content {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
`;

export const QCOFollowUpContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const QCOFollowUpMonthlyRequests = styled.div`
  padding: 20px;
  background: #fff;
  border: 1px solid #e6e8eb;
  border-radius: 10px;

  header {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
  }

  thead {
    th {
      height: 55px;
    }
  }

  th {
    text-align: left;
    height: 40px;
    line-height: 40px;
    color: #acacac;
  }

  td {
    white-space: normal;
    text-align: left;
    height: 35px;
    padding: 5px;
    font-size: 14px;
    font-weight: bold;
  }
`;
export const QCOFollowUpMonthlyRequestsSevenDays = styled.div``;
export const QCOFollowUpAccumulatedProfit = styled.div``;
