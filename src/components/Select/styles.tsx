import styled, { css } from 'styled-components';
import Tooltip from '../Tooltip';

interface ContainerProps {
  isFocused?: boolean;
  isFilled?: boolean;
  isErrored?: boolean;
}

export const Container = styled.div<ContainerProps>`
  background: #fff;
  border-radius: 10px;
  padding: 8px;
  width: 100%;
  margin-bottom: 18px;

  border: 2px solid #f0f0f0;
  color: #666360;

  display: flex;
  align-items: center;

  div:first-child {
    flex: 1;
  }

  ${props =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}

  ${props =>
    props.isFocused &&
    css`
      border: 2px solid #f0f0f0;
      color: #666360;
    `}

  .react-select__control {
    border-style: none;
  }

  .react-select__placeholder {
    color: #a9a9a9;
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;

  svg {
    margin-right: 0;
  }

  span {
    background: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
