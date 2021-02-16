import styled, { css } from 'styled-components';

interface StatusSituacaoProps {
  theme?: 'success' | 'warning' | 'info' | 'default';
}

const statusSituacaoVariations = {
  default: css`
    background: #f0f0f0;
    color: #3c3c3c;
  `,
  info: css`
    background: #ffeb9c;
    color: #9c6500;
  `,
  success: css`
    background: #c6efce;
    color: #006100;
  `,
  warning: css`
    background: #ffc7ce;
    color: #9c0006;
  `,
};

export const Main = styled.div`
  height: 100%;
  max-width: 1120px;
  overflow: auto;
  padding: 30px;

  color: #3c3c3c;
`;

export const MainHeader = styled.div`
  height: 90px;
  display: flex;
  align-items: flex-end;
`;

export const OcorrenciasTable = styled.table`
  width: 100%;
  margin-top: 33px;
  border-collapse: separate;
  border-spacing: 0 1em;

  & + tr {
    margin-top: 20px;
  }

  th {
    text-align: left;
    height: 40px;
    line-height: 40px;
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
    max-width: 270px;
  }
`;

export const StatusSituacao = styled.span<StatusSituacaoProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 160px;
  height: 26px;
  border-radius: 16px;

  ${props => statusSituacaoVariations[props.theme || 'default']}
`;
