import styled from 'styled-components';

export const Aside = styled.aside`
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 256px;
  max-width: 256px;
  height: 100vh;
  background: #fff;
  z-index: 1;

  .logo {
    width: 125px;
    margin-top: 23px;
  }

  h1 {
    color: #003379;
    font-size: 24px;
    font-weight: bold;
    margin-top: 30px;
  }

  ul {
    list-style: none;
    margin-top: 30px;

    li {
      display: flex;
      height: 56px;
      width: 200px;
      border-radius: 30px;
      align-items: center;
      justify-content: center;

      & + li {
        margin-top: 10px;
      }

      transition-duration: 0.3s;

      &:hover {
        background: #003379;
        a {
          color: #fff;
        }
        transform: scale(1.05);
      }

      svg {
        width: 30px;
        height: 30px;
        margin-right: 20px;
      }
    }

    a {
      display: flex;
      height: 56px;
      width: 200px;
      text-decoration: none;
      color: #a3a3a3;
      align-items: center;
      justify-content: center;
      border-radius: 30px;
    }

    a.active {
      background: #003379;
      color: #fff;
      cursor: default;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
      pointer-events: none;
    }
  }

  ul.adminLinks {
    margin-top: 20px;
  }

  hr {
    background: #d2cfcf;
    height: 2px;
    border: 0;
    width: 256px;
    margin-top: 20px;
  }

  button {
    display: flex;
    height: 56px;
    width: 200px;
    align-items: center;
    justify-content: start;
    color: #a3a3a3;
    background: transparent;
    border: 0;
    border-radius: 30px;
    text-decoration: none;
    margin-top: 20px;

    transition-duration: 0.3s;

    &:hover {
      background: #003379;
      color: #fff;
      transform: scale(1.05);
    }

    svg {
      width: 30px;
      height: 30px;
      margin-right: 20px;
      margin-left: 30px;
    }
  }
`;
