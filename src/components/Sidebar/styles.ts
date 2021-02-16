import styled from 'styled-components';

interface AsideProps {
  isSelected?: boolean;
}

export const Aside = styled.aside<AsideProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 256px;
  max-width: 256px;
  height: 100vh;

  .logo {
    width: 125px;
    margin-top: 23px;
  }

  h1 {
    color: #182390;
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

      &:hover {
        background: #182390;
        a {
          color: #fff;
        }
      }

      svg {
        width: 30px;
        height: 30px;
        margin-right: 20px;
      }
    }

    li.active {
      background: #182390;
      a {
        color: #fff;
        cursor: default;
      }
    }

    a {
      display: flex;
      height: 56px;
      width: 200px;
      text-decoration: none;
      color: #a3a3a3;
      align-items: center;
      justify-content: start;
      margin-left: 30px;
    }

    button {
      display: flex;
      height: 56px;
      width: 200px;
      text-decoration: none;
      color: #a3a3a3;
      align-items: center;
      justify-content: start;
      margin-left: 30px;
      background: transparent;
      border: 0;
      &:hover {
        color: #fff;
      }
    }
  }
  hr {
    position: absolute;
    background: #d2cfcf;
    height: 2px;
    border: 0;
    width: 256px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
`;
