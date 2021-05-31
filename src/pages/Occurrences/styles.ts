import styled from 'styled-components';

export const Main = styled.div`
  height: 100%;
  margin-right: 20px;
  padding: 20px;
  color: #3c3c3c;
`;

export const MainHeader = styled.div`
  height: 90px;
  display: flex;
  align-items: flex-end;
  margin-bottom: 15px;
`;

export const FilterBar = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  padding: 10px 0;
  margin-bottom: 15px;
  font-size: 14px;

  span {
    color: #a3a3a3;
    font-weight: bold;
  }

  div.dateFilter {
    display: flex;
    flex-direction: column;

    span.invalidDate {
      position: absolute;
      color: #9c0006;
      bottom: -10px;
    }
  }

  div.inputDates {
    display: flex;

    button {
      color: #3c3c3c;
      display: flex;
      align-items: center;
      background: transparent;
      border: 0;
      font-size: 14px;
      transition: color 0.2s;

      &:hover {
        color: #003379;
      }

      svg {
        margin-right: 5px;
      }
    }
  }
`;

export const OccurrenceTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;

  & + tr {
    margin-top: 20px;
  }

  th {
    text-align: left;
    height: 40px;
    line-height: 40px;
  }

  th.centered {
    text-align: center;
  }

  div.occurrenceInfo {
    display: flex;
    svg {
      margin-left: 10px;
      color: #be6464;
    }
  }

  tbody tr:hover {
    background: #f5f5f5;
    button.openDropAction {
      background: #f5f5f5;
    }
  }

  td {
    white-space: normal;
    text-align: left;
    height: 55px;
    padding: 5px;
    border-top: 1px solid #d2cfcf;
    font-size: 14px;
  }

  td.clientName {
    width: 270px;
  }

  td.centered {
    text-align: center;
  }

  td.occurrence-opened {
    color: #9c0006;
    font-weight: bold;
  }
`;
