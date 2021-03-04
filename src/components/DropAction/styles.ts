import styled, { css } from 'styled-components';

interface DropActionContentProps {
  isVisible?: boolean;
  position?: number;
}

export const Container = styled.div`
  position: relative;

  button.openDropAction {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border: 0;
    height: 40px;

    svg {
      margin-right: 8px;
      width: 20px;
      height: 20px;
    }
  }
`;

export const DropActionContent = styled.div<DropActionContentProps>`
  position: absolute;
  display: flex;
  flex-direction: column;
  right: 0;
  padding: 10px 0px;
  width: 200px;
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

  span.dropTitle {
    width: 100%;
    font-size: 14px;
    padding-left: 10px;
    color: #a3a3a3;
    text-align: start;
  }

  a.btnDropAction {
    text-decoration: none;
    display: flex;
    justify-content: start;
    align-items: center;
    font-size: 16px;
    color: #3c3c3c;
    padding: 12px 20px;
    transition: background 0.2s ease 0s;
    cursor: pointer;
    background: transparent;
    border: none;
    width: 100%;

    svg.drop {
      width: 16;
      height: 16;
      margin-right: 10px;
      color: #00a8cb;
    }

    &:hover {
      background: #e5e5e5;
    }
  }

  button.btnDropAction {
    display: flex;
    justify-content: start;
    align-items: center;
    font-size: 16px;
    color: #3c3c3c;
    padding: 12px 20px;
    transition: background 0.2s ease 0s;
    cursor: pointer;
    background: transparent;
    border: none;
    width: 100%;

    svg.drop {
      width: 16;
      height: 16;
      margin-right: 10px;
      color: #006100;
    }

    svg.drop.rev {
      color: #0d6efd;
    }

    svg.drop.cancel {
      color: #9c0006;
    }

    &:hover {
      background: #e5e5e5;
    }
  }

  div.otherOptions {
    padding: 10px 10px 0 10px;
  }
`;
