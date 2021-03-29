import styled, { css } from 'styled-components';

interface DropDetailsContentProps {
  position?: number;
}

export const Main = styled.div`
  height: 100%;
  width: 100%;
  max-width: 1120px;
  /* max-width: 980px; */

  margin: auto;
  padding: 20px;
  color: #3c3c3c;
`;

export const BoardDetails = styled.div`
  display: flex;
  margin-right: 20px;
  max-height: 716px;
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
    min-height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 20px;

    a {
      color: #182390;
      text-decoration: none;
      font-size: 14px;
      font-weight: bold;
      padding: 12px 20px;
      border-radius: 20px;
      &:hover {
        background: #e5e5e5;
      }
    }

    span.tagSituacao {
      position: absolute;
      right: 0;
    }
  }
`;

export const ActionsGroup = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;

  strong {
    margin-right: 5px;
    color: #3c3c3c;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    color: #3c3c3c;
    padding: 12px 20px;
    transition: background 0.2s ease 0s;
    cursor: pointer;
    background: transparent;
    border: none;
    border-radius: 20px;

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
`;

export const ActionGroupOthers = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 0;
  margin-bottom: 20px;

  strong {
    margin-right: 5px;
    color: #3c3c3c;
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
  width: 100%;
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
  align-items: center;
  flex-direction: column;
  font-size: 14px;
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

  &:hover {
    background: #f5f5f5;
  }

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