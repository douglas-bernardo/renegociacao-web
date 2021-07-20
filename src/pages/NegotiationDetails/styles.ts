import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface SectionLeftProps {
  situacao_id: number;
}

export const Main = styled.div`
  height: 100%;
  width: 100%;
  max-width: 1120px;
  padding: 20px;
  color: #3c3c3c;
`;

export const BoardDetails = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #f0f0f0;
  box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  min-height: 590px;
`;

export const Sections = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
`;

export const SectionLeft = styled.section<SectionLeftProps>`
  flex: 1;
  padding: 24px;
  background: #fff;

  header {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    ${props =>
      props.situacao_id === 1 &&
      css`
        min-height: 90px;
      `}

    div.linkBackPage {
      margin-bottom: 5px;

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

    div.tagSituacao {
      position: absolute;
      padding: 15px;
      right: 0;
    }

    div.negotiationDetailsAdmin {
      margin-top: 25px;
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

  strong {
    margin-right: 5px;
    color: #3c3c3c;
  }
`;

export const SectionRight = styled.section`
  flex: 1;
  padding: 24px;
  width: 100%;
  /* max-width: 400px; */
  background: #f2f5f8;

  header {
    display: flex;
    height: 45px;

    div.negotiationInfo {
      display: flex;
      svg {
        cursor: pointer;
        margin-left: 10px;
        color: #be6464;
      }
    }
  }

  hr {
    border: 1px solid #d2cfcf;
    margin: 0 -24px 10px -24px;
  }
`;
