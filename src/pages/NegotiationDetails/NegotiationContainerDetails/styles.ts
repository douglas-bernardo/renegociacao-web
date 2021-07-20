import styled from 'styled-components';
import { Form as Unform } from '@unform/web';
import { shade } from 'polished';

export const Container = styled.div`
  position: relative;

  div.editControls {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;

    button {
      background: transparent;
      border: 0;
      color: #a3a3a3;
      padding: 10px;
      transition: color 0.2s;

      &:hover {
        color: #003379;
      }
    }

    button.saveEdit {
      color: #39b100;
      &:hover {
        color: ${shade(0.2, '#39b100')};
      }
    }

    span.separator {
      align-self: stretch;
      background-color: hsl(0, 0%, 80%);
      margin-bottom: 8px;
      margin-top: 8px;
      margin-left: 5px;
      margin-right: 5px;
      width: 1px;
      box-sizing: border-box;
    }

    button.cancelEdit {
      color: #e74c3c;
      &:hover {
        color: ${shade(0.2, '#e74c3c')};
      }
    }
  }
`;

export const ContainerDetails = styled.div`
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

export const StaticContainerDetails = styled.div`
  div {
    margin-bottom: 10px;
  }

  div p {
    line-height: 30px;
  }
`;

export const FormEditNegotiation = styled(Unform)`
  div.row {
    margin-bottom: 20px;

    strong {
      display: inline-block;
      margin-bottom: 5px;
    }

    div.selectEdit {
      padding: 0;
    }

    div[data-testid='input-container'] {
      padding: 10px;
    }
  }
`;
