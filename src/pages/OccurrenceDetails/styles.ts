import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface DropDetailsContentProps {
  position?: number;
}

export const Main = styled.div`
  height: 100%;
  width: 100%;
  max-width: 1120px;
  padding: 2.5rem;
  color: #3c3c3c;
`;

export const BoardDetails = styled.div`
  border: 1px solid #f0f0f0;
  box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
`;

export const Sections = styled.div`
  display: flex;
  flex-wrap: wrap;
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

    div.linkBackPage {
      a {
        display: flex;
        align-items: center;
        color: #003379;

        text-decoration: none;
        font-weight: bold;
        transition: color 0.2s;

        svg {
          margin-right: 5px;
        }

        span {
          margin-top: 2px;
        }

        &:hover {
          color: ${shade(0.2, '#003379')};
        }
      }
    }

    div.statusOccurrence {
      position: absolute;
      right: 0;

      span {
        margin-left: 10px;
      }

      span.occurrence-opened {
        color: #9c0006;
        font-weight: bold;
      }
    }

    p.ocorrenciaInfo {
      color: #be6464;
    }
  }
`;

export const ActionsGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 20px 0;

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
    border-radius: 5px;

    svg {
      width: 16;
      height: 16;
      margin-right: 10px;
    }

    &:hover {
      background: #e5e5e5;
    }
  }

  button.register {
    border: 1px solid #006100;
    color: #006100;
    margin-right: 10px;
  }

  button.close {
    border: 1px solid #9c0006;
    color: #9c0006;
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

export const SectionRight = styled.section`
  flex: 1;
  padding: 24px;
  width: 100%;

  header {
    height: 45px;
  }

  hr {
    border: 1px solid #f0f0f0;
    margin: 0 -24px 0 -24px;
    margin-bottom: 30px;
  }
`;

export const LoadingContainer = styled.div`
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

export const Atendimento = styled.div`
  position: relative;
  display: flex;
  justify-content: start;
  padding: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
  width: 100%;
  /* width: 340px; */

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
  right: 20px;

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
