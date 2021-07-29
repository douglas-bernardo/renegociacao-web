import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  gap: 15px;

  div {
    display: flex;
    align-items: center;

    a {
      color: #3c3c3c;
      text-decoration: none;
      transition: 0.3s;

      &:hover {
        color: #336299;
      }
    }

    svg {
      margin-left: 15px;
    }
  }
`;
