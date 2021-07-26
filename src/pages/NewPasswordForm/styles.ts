import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

import signUpBackgroundImg from '../../assets/beachpark.png';

export const Container = styled.div`
  height: 100vh;

  display: flex;
  align-items: stretch;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 700px;
`;

const appearFromRight = keyframes`
  from{
    opacity: 0;
    transform: translateX(50px);
  }
  to{
    opacity: 1;
    transform: translateX(0);
  }

`;

export const AnimationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  animation: ${appearFromRight} 1s;

  form {
    margin: 80px 0;
    width: 340px;
    text-align: center;

    h1 {
      margin-bottom: 24px;
      color: #182390;
    }

    p.resetPasswordMessage {
      padding: 10px;
      margin-bottom: 24px;
      background: #ffc7ce;
      color: #ff365f;
      border: 3px solid #ff365f;
      border-radius: 8px;
    }

    a {
      color: #f4ede8;
      display: block;
      margin-top: 24px;
      text-decoration: none;
      transition: color 0.2s;

      &:hover {
        color: ${shade(0.2, '#f4EDE8')};
      }
    }
  }

  > a {
    color: #003379;
    display: block;
    margin-top: 24px;
    text-decoration: none;
    transition: color 0.2s;

    display: flex;
    align-items: center;

    &:hover {
      color: ${shade(0.2, '#003379')};
    }

    svg {
      margin-right: 16px;
    }
  }

  button.backLogon {
    display: flex;
    align-items: center;

    color: #003379;
    background: transparent;
    border: 0;
    padding: 8px;
    border-radius: 10px;
    transition: 0.2s;

    &:hover {
      background-color: #98c1d8;
      transform: scale(1.05);
    }

    svg {
      margin-right: 10px;
    }
  }
`;

export const Background = styled.div`
  flex: 1;
  background: url(${signUpBackgroundImg}) no-repeat center;
  background-size: cover;
`;
