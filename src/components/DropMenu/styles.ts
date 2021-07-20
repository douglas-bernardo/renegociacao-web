import styled, { css } from 'styled-components';

interface DropActionContentProps {
  isVisible?: boolean;
  position?: number;
}

export const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;

  button.openDropAction {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border: 0;
    height: 40px;
    font-size: 15px;

    svg {
      margin-right: 8px;
      /* width: 18px;
      height: 18px; */
    }
  }
`;

export const DropActionContent = styled.div<DropActionContentProps>`
  position: absolute;
  right: 0;
  padding: 10px 0px;
  min-width: 200px;
  width: max-content;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 5px;
  z-index: 1;
  transition: opacity 0.2s ease 0s, visibility 0.2s ease 0s;
  opacity: 1;

  ${props =>
    props.position && props.position > 500
      ? css`
          bottom: 40px;
          box-shadow: rgb(0 0 0 / 40%) 0px -2px 5px;
        `
      : css`
          top: 40px;
          box-shadow: rgb(0 0 0 / 40%) 0px 2px 5px;
        `};
`;
