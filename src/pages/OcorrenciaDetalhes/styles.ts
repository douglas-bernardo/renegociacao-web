import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface DropDetailsContentProps {
  position?: number;
}

export const Main = styled.div`
  height: 100%;
  max-width: 1120px;
  padding: 20px;
  color: #3c3c3c;
`;

export const BoardDetails = styled.div`
  display: flex;
  max-height: 700px;
  overflow: auto;

  border: 1px solid #f0f0f0;
  box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.25);
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

export const SectionRight = styled.section`
  flex: 1;
  padding: 24px;
  max-width: 400px;

  header {
    height: 45px;
  }

  hr {
    border: 1px solid #f0f0f0;
    margin: 0 -24px 0 -24px;
    margin-bottom: 30px;
  }
`;

export const LoadingContainder = styled.div`
  display: flex;
  justify-content: center;
`;

export const AtendimentoContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 550px;
  /* padding-right: 5px; */

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
  position: relative;
  display: flex;
  justify-content: start;
  padding: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
  width: 340px;

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

    h5 {
      padding-right: 10px;
    }

    p {
      font-size: 14px;
    }
  }
`;

export const ContainerDetails = styled.div`
  position: absolute;
  right: 5px;

  button.atendDetails {
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 0;
  }
`;

export const DropDetails = styled.div<DropDetailsContentProps>`
  position: absolute;
  display: flex;
  right: 0;
  padding: 10px;
  width: 285px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 5px;
  overflow: auto;
  max-height: 250px;
  transition: opacity 0.2s ease 0s, visibility 0.2s ease 0s;
  opacity: 1;
  z-index: 1;

  font-size: 14px;

  border: 2px solid #f0f0f0;
  box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.25);

  /* ${props =>
    props.position && props.position > 500
      ? css`
          bottom: 15px;
        `
      : css`
          top: 15px;
        `}; */

  ::-webkit-scrollbar {
    width: 10px;
  }

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
