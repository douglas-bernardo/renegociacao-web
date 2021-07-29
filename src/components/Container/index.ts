import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  margin: 0 auto;
  display: flex;
`;

export const MainHeader = styled.div`
  position: relative;
  height: 90px;
  display: flex;
  align-items: flex-end;
  margin-bottom: 30px;

  button.refreshPage {
    position: absolute;
    display: flex;
    align-items: center;

    top: 0;
    right: 0;

    background: #caf0f8;
    color: #003379;
    border: 0;
    font-size: 15px;
    height: 30px;
    padding: 5px;
    border-radius: 5px;
    transition: 0.3s;

    &:hover {
      background: #98c1d8;
    }

    svg {
      margin-right: 5px;
    }
  }
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
