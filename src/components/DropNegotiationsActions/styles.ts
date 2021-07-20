import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;

  span.dropTitle {
    width: 100%;
    font-size: 14px;
    padding-left: 10px;
    color: #a3a3a3;
    text-align: start;
  }

  a.btnDropAction {
    text-decoration: none;
    display: flex;
    justify-content: start;
    align-items: center;
    font-size: 16px;
    color: #3c3c3c;
    padding: 12px 20px;
    transition: background 0.2s ease 0s;
    cursor: pointer;
    background: transparent;
    border: none;
    width: 100%;

    svg.drop {
      width: 16;
      height: 16;
      margin-right: 10px;
      color: #00a8cb;
    }

    &:hover {
      background: #e5e5e5;
    }
  }

  button.btnDropAction {
    display: flex;
    justify-content: start;
    align-items: center;
    font-size: 16px;
    color: #3c3c3c;
    padding: 12px 20px;
    transition: background 0.2s ease 0s;
    cursor: pointer;
    background: transparent;
    border: none;
    width: 100%;

    svg.drop {
      width: 16;
      height: 16;
      margin-right: 10px;
      color: #006100;
    }

    svg.drop.rev {
      color: #0d6efd;
    }

    svg.drop.cancel {
      color: #9c0006;
    }

    &:hover {
      background: #e5e5e5;
    }
  }

  div.otherOptions {
    padding: 10px 10px 0 10px;
  }
`;
