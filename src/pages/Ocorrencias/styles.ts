import styled, { css } from 'styled-components';

interface PaginationProps {
  isSelected?: boolean;
}

export const Main = styled.div`
  height: 100%;
  max-width: 1120px;
  padding: 30px;

  color: #3c3c3c;
`;

export const MainHeader = styled.div`
  height: 90px;
  display: flex;
  align-items: flex-end;
`;

export const Loading = styled.div`
  font-size: 15px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const OcorrenciasTable = styled.table`
  width: 100%;
  margin-top: 33px;
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
`;

export const PaginationBar = styled.div`
  display: flex;
  padding: 12px 0;
  align-items: center;
  justify-content: space-between;
  max-width: 1120px;

  div.pageLimitToShow {
    display: flex;
    align-items: center;

    span {
      margin-right: 5px;
    }

    select {
      margin-right: 5px;
    }

    div.pageLimitToShowControl {
      width: 100px;
      margin-right: 5px;
    }
  }
`;

export const Pagination = styled.div`
  display: flex;

  button.controlNavPage {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    color: #003379;
    margin-right: 10px;
    border: 0;
    background: transparent;
  }
`;

export const Page = styled.button<PaginationProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  color: #003379;
  font-size: 16px;
  margin-right: 10px;
  border: 0;
  background: transparent;

  ${props =>
    props.isSelected &&
    css`
      background: #a6cee3;
      border-radius: 5px;
      cursor: default;
    `}
`;
