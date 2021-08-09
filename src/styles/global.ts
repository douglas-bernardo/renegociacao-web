import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  *{
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  @media (max-width: 1080px) {
    html {
      font-size: 93.75%; // 15px
    }
  }

  @media (max-width: 720px) {
    html {
      font-size: 87.5%; // 14px
    }
  }

  body {
    background: #FFFFFF;
    color: #A3A3A3;
    -webkit-font-smoothing: antialiased;

    overflow: auto;

    ::-webkit-scrollbar {
    width: 10px;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      background: #e5e5e5;
      border-radius: 10px;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background: #a3a3a3;
    }
  }

  body, input, button {
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    /* font-size-adjust: 0.5; */
    outline: 0;
  }

  h1, h2, h3, h4, h5, h6, strong {
    font-weight: 500;
  }

  button {
    cursor: pointer;
  }
`;
