import styled from 'styled-components';

export const Main = styled.div`
  height: 100%;
  width: 100%;
  max-width: 1120px;
  padding: 20px;
  color: #3c3c3c;
`;

export const MainHeader = styled.div`
  height: 90px;
  display: flex;
  align-items: flex-end;
  margin-bottom: 15px;
`;

export const BoardDetails = styled.div`
  border: 1px solid #f0f0f0;
  box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
`;

export const Sections = styled.div`
  display: flex;
  margin-right: 20px;
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

    div.tagSituacao {
      position: absolute;
      padding: 15px;
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
    /* margin-bottom: 30px; */
  }
`;
