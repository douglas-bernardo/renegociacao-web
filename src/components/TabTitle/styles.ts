import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100px;
  height: 100%;
  padding: 0 10px;

  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 0.175rem;
    right: 0;
    bottom: -2px;
    transition: all 0.3s ease-in-out;
  }

  &.active-tab::after {
    background: #ff365f;
  }

  button {
    width: 100%;
    height: 100%;
    background: transparent;
    border: 0;
  }
`;
