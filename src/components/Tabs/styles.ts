import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;

  div.tabs {
    display: flex;
    align-items: center;
    justify-content: start;
    margin-bottom: 30px;
    border-bottom: 2px solid #a3a3a3;
    height: 50px;
  }

  /* div.content {
    background: white;
    padding: 20px;
    width: 100%;
    height: 100%;
  } */

  /* div.tab-content {
    display: none;
  } */
`;
