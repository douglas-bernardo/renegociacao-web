import styled from 'styled-components';
import { shade } from 'polished';

export const Main = styled.div`
  display: flex;
  margin-top: 10px;
  margin-bottom: 10px;
  height: 100%;
  max-height: 700px;
  max-width: 1120px;
  overflow: auto;

  color: #3c3c3c;

  border: 1px solid #f0f0f0;
  box-shadow: 4px 0px 4px #f2f5f8;
  border-radius: 10px;
`;

export const SectionLeft = styled.section`
  flex: 1;
  padding: 24px;
  background: #f2f5f8;

  header {
    position: relative;
    height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 20px;

    a {
      color: #182390;
      text-decoration: none;
      font-size: 14px;
      font-weight: bold;
      &:hover {
        color: ${shade(0.2, '#182390')};
      }
    }

    span.tagSituacao {
      position: absolute;
      right: 0;
    }
  }
`;

export const Card = styled.div`
  background: #fff;
  padding: 10px;
  font-size: 14px;
  margin-bottom: 20px;

  box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.25);
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

export const SectionRight = styled.section`
  flex: 1;
  padding: 24px;
  max-width: 355px;
  overflow: auto;

  header {
    height: 45px;
  }

  hr {
    border-top: 1px solid #f0f0f0;
    margin: 0 -22px 0 -22px;
    margin-bottom: 30px;
  }
`;

export const AtendimentoContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 550px;
  padding-right: 5px;

  ::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  /* ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
  } */

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: #f2f5f8;
    border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: #a3a3a3;
  }
`;

export const Atendimento = styled.div`
  display: flex;
  justify-content: start;
  padding: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);

  header {
    margin-right: 10px;

    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
  }

  aside {
    line-height: 25px;
    display: flex;
    flex-direction: column;

    span {
      font-size: 14px;
    }
  }
`;
