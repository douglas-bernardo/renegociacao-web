import styled, { css } from 'styled-components';

interface ContainerProps {
  isActive: boolean;
}

export const Container = styled.div<ContainerProps>`
  background-color: #c4c4c4;
  cursor: pointer;
  user-select: none;

  width: 50px;
  height: 25px;

  position: relative;
  border-radius: 12.5px;

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
    width: 25px;
    height: 25px;

    background-color: #fff;
    color: white;

    cursor: pointer;
    min-width: unset;
    border-radius: 50%;

    left: 0px;
    transition: all 0.1s ease;

    ${props =>
      props.isActive &&
      css`
        left: 25px;
      `}
  }
`;
