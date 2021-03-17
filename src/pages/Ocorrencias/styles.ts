import styled from 'styled-components';

export const Main = styled.div`
  height: 100%;
  max-width: 1120px;
  padding: 20px;
  color: #3c3c3c;
`;

export const MainHeader = styled.div`
  height: 90px;
  display: flex;
  align-items: flex-end;
`;

export const LoadingContainder = styled.div`
  display: flex;
  justify-content: center;
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
