import styled, { css } from 'styled-components';

interface PaginationProps {
  isSelected?: boolean;
}

export const Container = styled.div`
  display: flex;
  padding: 12px 0;
  align-items: center;
  justify-content: space-between;
  margin-right: 20px;
  font-size: 15px;

  div.pageLimitToShow {
    display: flex;
    align-items: center;

    span {
      margin-right: 5px;
    }

    select {
      margin-right: 5px;
    }

    div.pageLimitToShowControl {
      width: 100px;
      margin-right: 5px;
    }
  }
`;

export const PagesContainer = styled.div`
  display: flex;

  button.controlNavPage {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    color: #003379;
    margin-right: 10px;
    border: 0;
    background: transparent;
  }
`;

export const Page = styled.button<PaginationProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  color: #003379;
  font-size: 16px;
  margin-right: 10px;
  border: 0;
  background: transparent;
  font-size: 15px;

  ${props =>
    props.isSelected &&
    css`
      background: #a6cee3;
      border-radius: 15px;
      cursor: default;
    `}
`;
