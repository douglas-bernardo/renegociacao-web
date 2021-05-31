import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  margin: 0 auto;
  display: flex;
`;

export const Content = styled.div`
  margin-left: 256px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const Card = styled.div`
  background: #fff;
  padding: 10px;
  font-size: 14px;
  margin-bottom: 20px;

  border: 2px solid #f0f0f0;
  /* box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.25); */
  border-radius: 10px;
`;

export const CardHeader = styled.div``;
export const CardBody = styled.div`
  div.row {
    display: flex;
    padding: 8px 0;
  }

  span {
    margin-right: 10px;
  }
`;
