import styled from 'styled-components';
import { Form as Unform } from '@unform/web';

export const Container = styled.div`
  padding: 30px;
  min-height: 600px;
`;

export const Form = styled(Unform)`
  display: flex;
  flex-direction: column;

  h1 {
    font-weight: 600;
    font-size: 30px;
    line-height: 30px;
    margin-bottom: 40px;
  }

  div {
    margin-top: 0px;
  }

  div.control {
    display: flex;
  }

  div.control > div {
    /* width: 250px; */
    :not(:last-child) {
      margin-right: 20px;
    }
  }

  div.row {
    display: flex;
    margin-bottom: 18px;
  }

  div.row div {
    /* width: 250px; */
    :not(:last-child) {
      margin-right: 20px;
    }
  }

  button {
    margin-top: 18px;
    align-self: flex-end;
  }

  button {
    font-weight: 600;
    border-radius: 8px;
    border: 0;
    background: #02c697;
    color: #fff;

    display: flex;
    flex-direction: row;
    align-items: center;

    .text {
      padding: 16px 24px;
    }

    .icon {
      display: flex;
      padding: 16px 16px;
      background: #02c697;
      border-radius: 0 8px 8px 0;
      margin: 0 auto;
    }
  }

  .logoErrorInput {
    margin-left: 5px;
  }
`;
