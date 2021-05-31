import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 260px;
  padding: 30px;

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

    button.confirmYes {
      background: #02c697;
    }

    button.confirmNo {
      background: #f5f8fa;
      color: #3c3c3c;
    }
  }
`;
