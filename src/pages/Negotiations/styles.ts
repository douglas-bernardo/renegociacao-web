import styled from 'styled-components';
import { shade } from 'polished';

export const Main = styled.div`
  height: 100%;
  min-height: 600px;
  margin-right: 20px;
  padding: 2.5rem;
  color: #3c3c3c;
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
  }

  div.inputDates {
    display: flex;

    button {
      color: #3c3c3c;
      display: flex;
      align-items: center;
      background: #eb5757;
      color: #fff;
      border: 0;
      border-radius: 10px;
      padding: 0 10px;
      font-size: 14px;

      transition: background-color 0.2s;

      &:hover {
        background: ${shade(0.2, '#eb5757')};
      }

      svg {
        margin-right: 5px;
      }
    }
  }

  div.typesFilters {
    display: flex;
  }
`;

export const NegotiationsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;

  /* & + tr {
    margin-top: 20px;
  } */

  th {
    text-align: left;
    height: 40px;
    line-height: 40px;
    min-width: 100px;
  }

  th.centered {
    text-align: center;
  }

  th.situation {
    min-width: 160px;
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
    height: 60px;
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
`;
