import styled, { css } from 'styled-components';

import searchIcon from '../../assets/search.svg';

interface DropdownMenuProps {
  isVisible?: boolean;
}

export const Container = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
  padding: 20px;

  height: 100px;

  div input {
    width: 220px;
    border: 0;
    height: 34px;
    padding-left: 50px;
    font-size: 12px;
    background: url(${searchIcon}) no-repeat 5px center;
  }
`;

export const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 25px;
    height: 25px;
    margin-right: 30px;
    cursor: pointer;
  }

  button {
    position: relative;
    display: flex;
    height: 56px;
    width: 200px;
    border-radius: 30px;
    align-items: center;
    justify-content: space-between;
    margin-left: auto;
    background: #e5e5e5;
    border: 0;

    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-left: 4px;
    }
  }
`;

export const DropdownMenu = styled.div`
  z-index: 1;
`;

export const DropdownMenuContent = styled.div<DropdownMenuProps>`
  position: absolute;
  right: 0px;
  top: calc(100% + 24px);
  width: 256px;
  padding: 0px;
  background: #fff;
  border-radius: 5px;
  box-shadow: rgb(0 0 0 / 40%) 0px 5px 10px;
  transition: opacity 0.2s ease 0s, visibility 0.2s ease 0s;
  opacity: 1;

  ${props =>
    props.isVisible
      ? css`
          visibility: visible;
        `
      : css`
          visibility: hidden;
        `}

  a {
    display: flex;
    justify-content: start;
    align-items: center;
    font-size: 16px;
    color: #a3a3a3;
    padding: 12px 24px;
    transition: background 0.2s ease 0s;
    cursor: pointer;
    background: transparent;
    border: none;
    width: 100%;
    text-decoration: none;

    svg.drop {
      width: 16;
      height: 16;
      margin-right: 0;
    }

    span {
      margin-left: 24px;
    }

    &:hover {
      background: #e5e5e5;
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: -8px;
    right: 19px;
    width: 0px;
    height: 0px;
    border-style: solid;
    border-width: 0px 8px 8px;
    border-color: transparent transparent #fff;
  }
`;
