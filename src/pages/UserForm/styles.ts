import styled from 'styled-components';
import { Form as Unform } from '@unform/web';

export const Main = styled.div`
  height: 100%;
  margin-right: 20px;
  padding: 20px;
  color: #3c3c3c;
`;

export const ContainerRegister = styled.div`
  position: relative;
  padding: 50px;
  background: #fff;
  border-radius: 10px;

  min-height: 520px;

  button.userSubmit {
    position: absolute;
    bottom: 0;
    right: 60px;

    display: flex;
    height: 40px;
    width: 178px;
    align-items: center;
    justify-content: center;
    color: #fff;
    background: #02c697;
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

  div.row.userTimesharing {
    width: 50%;
  }

  div.searchUserTimesharing {
    position: relative;
    display: flex;
    align-items: center;

    svg {
      margin-left: 10px;
    }
  }

  div.containerResults {
    position: absolute;
    top: 70px;
    left: 0;
    overflow: auto;

    background: #fff;
    padding: 10px;
    min-width: 300px;
    min-height: 250px;
    max-height: 400px;
    border-radius: 5px;
    box-shadow: rgb(0 0 0 / 40%) 0px 5px 10px;
    transition: opacity 0.2s ease 0s, visibility 0.2s ease 0s;
    opacity: 1;
    z-index: 1;

    ::-webkit-scrollbar {
      width: 10px;
    }

    /* Track */
    /* ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 5px grey;
      border-radius: 10px;
    } */

    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: #caf0f8;
      border-radius: 10px;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: #98c1d8;
    }

    ul {
      list-style: none;
    }

    li.listItem {
      padding: 5px;
      cursor: pointer;
      border-radius: 5px;

      & + li {
        margin-bottom: 5px;
      }

      &:hover {
        background: #98c1d8;
      }
    }
  }

  div.label {
    padding: 10px;
    margin-right: 5px;
    min-width: 200px;
    font-weight: bold;
  }

  button {
    align-self: flex-end;
  }

  .logoErrorInput {
    margin-left: 5px;
  }
`;
