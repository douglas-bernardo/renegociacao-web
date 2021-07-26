import styled, { css } from 'styled-components';

export interface ButtonsProps {
  theme: {
    confirmYes?: 'info' | 'success' | 'danger';
    confirmNo?: 'info' | 'success' | 'danger';
  };
}

interface ContainerProps {
  buttonType?: ButtonsProps;
}

const buttonTypeVariations = {
  info: css`
    background: #f5f8fa;
    color: #3c3c3c;
  `,
  success: css`
    background: #02c697;
    color: #fff;
  `,
  danger: css`
    background: #ff365f;
    color: #fff;
  `,
};

export const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 30px;

  header {
    margin-bottom: 20px;
  }

  main {
    display: flex;
    flex-direction: column;

    align-items: center;
    margin-bottom: 20px;

    span {
      margin-bottom: 30px;
      color: #02c697;
    }

    p {
      white-space: pre-line;
      margin-bottom: 10px;
    }

    small {
      color: #c53030;
    }
  }

  footer {
    display: flex;
    justify-content: flex-end;

    button {
      display: flex;
      height: 40px;
      width: 150px;
      align-items: center;
      justify-content: center;
      color: #fff;
      border: 0;
      border-radius: 20px;
      text-decoration: none;
      font-weight: bold;

      transition: filter 0.2s;

      .text {
        padding: 16px 24px;
        font-weight: bold;
      }

      & + button {
        margin-left: 10px;
      }

      &:hover {
        filter: brightness(0.95);
      }
    }

    button.confirmNo {
      ${props =>
        buttonTypeVariations[props.buttonType?.theme.confirmYes || 'info']}
    }
  }
`;
