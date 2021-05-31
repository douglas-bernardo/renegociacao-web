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
    margin-bottom: 30px;
  }
`;

// export const NegotiationContainerDetails = styled.div`
//   position: relative;

//   div.editNegotiation {
//     position: absolute;
//     right: 20px;

//     button {
//       background: transparent;
//       border: 0;
//       color: #a3a3a3;
//       transition: color 0.2s;

//       &:hover {
//         color: #003379;
//       }
//     }
//   }
// `;

// export const ContainerDetails = styled.div`
//   div {
//     margin-bottom: 10px;
//   }

//   div p {
//     line-height: 30px;
//   }
// `;

// export const FormEditNegotiation = styled(Unform)`
//   position: relative;
//   height: 540px;

//   button {
//     height: 30px;
//     width: 100px;
//     border: 0;
//     border-radius: 5px;
//     transition: color 0.2s;

//     &:hover {
//       background: ${shade(0.2, '#efefef')};
//     }
//   }

//   button:first-child {
//     margin-right: 5px;
//   }

//   div.row {
//     margin-bottom: 20px;

//     strong {
//       display: inline-block;
//       margin-bottom: 5px;
//     }

//     div[data-testid='input-container'] {
//       padding: 10px;
//     }
//   }

//   footer {
//     position: absolute;
//     right: 0px;

//     button.saveEdit {
//       font-weight: 600;

//       border: 0;
//       background: #39b100;
//       color: #fff;

//       &:hover {
//         background: ${shade(0.2, '#39b100')};
//       }
//     }
//   }
// `;
