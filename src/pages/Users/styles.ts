import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface ActionButtonProps {
  isReseted?: boolean;
}

export const Main = styled.div`
  height: 100%;
  margin-right: 20px;
  padding: 20px;
  color: #3c3c3c;

  div.pageUserControls {
    display: flex;
    margin: 30px 0;

    a {
      display: flex;
      height: 40px;
      min-width: 100px;
      align-items: center;
      justify-content: center;
      color: #fff;
      background: #336299;
      border: 0;
      border-radius: 20px;
      text-decoration: none;

      transition-duration: 0.3s;

      &:hover {
        background: ${shade(0.2, '#336299')};
        transform: scale(1.05);
      }
    }
  }
`;

export const UsersTable = styled.table`
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

  div.roles {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }

  a {
    text-decoration: none;
    color: #3c3c3c;
  }
`;

export const ActionButton = styled.button<ActionButtonProps>`
  background: transparent;
  border: 0;
  margin-right: 15px;
  color: #3c3c3c;

  ${props =>
    props.isReseted &&
    css`
      color: #d2cfcf;
      cursor: default;
    `}
`;
