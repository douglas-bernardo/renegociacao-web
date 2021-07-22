import styled, { css } from 'styled-components';

interface ContainerProps {
  isActive: boolean;
}

export const Container = styled.div<ContainerProps>`
  background-color: #c4c4c4;
  cursor: pointer;
  user-select: none;

  width: 50px;
  height: 26px;

  border-radius: 3px;
  padding: 2px;
  position: relative;
  border-radius: 17px;

  ${props =>
    props.isActive &&
    css`
      background-color: #46d8d5;
    `}

  div.dialog-button {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 23px;
    height: 23px;

    font-size: 14px;
    line-height: 16px;
    font-weight: bold;
    background-color: #fff;
    color: white;
    /* padding: 8px 12px; */
    min-width: 46px;

    cursor: pointer;
    min-width: unset;
    border-radius: 15px;

    left: 1px;
    /* transition: all 0.1s ease; */

    ${props =>
      props.isActive &&
      css`
        left: 26px;
      `}
  }
`;
