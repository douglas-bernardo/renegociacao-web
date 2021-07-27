import styled from 'styled-components';
import { shade } from 'polished';
import { Form as Unform } from '@unform/web';

export const Main = styled.div`
  height: 100%;
  margin-right: 20px;
  padding: 20px;
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

  button.userSubmit {
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
    display: flex;
    align-items: center;
    justify-content: center;
    top: 70px;
    left: 0;
    overflow: auto;

    background: #fff;
    padding: 20px;
    min-width: 300px;
    max-height: 400px;
    border-radius: 5px;
    box-shadow: rgb(0 0 0 / 40%) 0px 5px 10px;
    transition: opacity 0.2s ease 0s, visibility 0.2s ease 0s;
    opacity: 1;
    z-index: 1;

    ::-webkit-scrollbar {
      width: 10px;
    }

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
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      list-style: none;
      width: 100%;
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

    p {
      position: absolute;
      padding: 10px;
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

export const RoleBoard = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin-bottom: 30px;
  font-weight: bold;

  header {
    margin-bottom: 20px;
  }

  main {
    display: flex;
    flex-wrap: wrap;

    gap: 25px;
    padding: 10px;

    div.roleItem {
      display: flex;
      align-items: center;
      padding: 10px;

      p {
        margin-left: 10px;
      }
    }
  }
`;
