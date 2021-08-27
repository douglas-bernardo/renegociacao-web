import styled from 'styled-components';
import { shade } from 'polished';
import { Form as Unform } from '@unform/web';

export const Main = styled.div`
  height: 100%;
  margin-right: 20px;
  padding: 2.5rem;
  color: #3c3c3c;

  div.linkBackPage {
    display: flex;
    margin: 30px 0px;
    height: 40px;
    a {
      display: flex;
      align-items: center;
      color: #003379;

      text-decoration: none;
      font-weight: bold;
      transition: color 0.2s;

      svg {
        margin-right: 5px;
      }

      span {
        margin-top: 2px;
      }

      &:hover {
        color: ${shade(0.2, '#003379')};
      }
    }
  }
`;

export const ContainerRegister = styled.div`
  position: relative;
  background: #fff;
  border-radius: 10px;
  max-width: 900px;

  button.roleSubmit {
    float: right;
    display: flex;
    height: 40px;
    width: 178px;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: #46d8d5;
    border: 0;
    border-radius: 8px;
    text-decoration: none;

    .text {
      padding: 16px 24px;
      font-weight: bold;
    }
  }
`;

export const Form = styled(Unform)`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;

  h1 {
    font-weight: 600;
    font-size: 36px;
    line-height: 36px;
    margin-bottom: 40px;
  }

  div {
    margin-top: 0px;
  }

  div.row {
    display: flex;

    :not(:last-child) {
      margin-bottom: 30px;
    }
  }

  div.label {
    padding: 10px;
    margin-right: 5px;
    min-width: 200px;
    font-weight: bold;
  }

  [data-test-id='input-role'] {
    background: #f0f0f0;
  }

  button {
    align-self: flex-end;
  }
`;

export const GoalsMonthBoard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin-bottom: 30px;

  header {
    font-weight: bold;
    margin-bottom: 30px;
  }

  main {
    margin: 0 auto;
    display: grid;
    grid-gap: 1rem;
    width: 100%;

    grid-template-columns: repeat(2, 1fr);

    header {
      margin-bottom: 20px;
    }

    div.label {
      min-width: 100px;
    }

    div.goalItem {
      display: flex;
      align-items: center;
      padding: 10px;
      min-height: 60px;

      p {
        margin-left: 10px;
        font-size: 15px;
      }
    }
  }
`;
