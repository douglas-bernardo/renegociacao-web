import styled from 'styled-components';

export const Container = styled.div`
  padding: 20px;
  background: #fff;
  border: 1px solid #e6e8eb;
  border-radius: 10px;

  & + div {
    margin-top: 10px;
  }

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
