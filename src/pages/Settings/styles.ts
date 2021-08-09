import styled from 'styled-components';

export const Main = styled.div`
  height: 100%;
  margin-right: 20px;
  padding: 2.5rem;
  color: #3c3c3c;
`;

export const CardsContainer = styled.div`
  display: flex;
  gap: 50px;
  padding: 50px 25px;
  flex-wrap: wrap;
`;

export const SettingCard = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;

  padding: 10px;
  width: 290px;
  height: 120px;

  border: 1px solid #a3a3a3;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 5px;

  transition-duration: 0.3s;

  &:hover {
    transform: scale(1.05);
  }

  a {
    width: 100%;
    height: 100%;
    text-decoration: none;

    display: flex;
    justify-content: start;
    align-items: center;

    color: #3c3c3c;
  }

  img {
    width: 60px;
    height: 60px;
    margin-right: 20px;
    border-radius: 50%;
  }

  div.cardContent {
    display: flex;
    flex-direction: column;

    h3 {
      line-height: 25px;
      margin-bottom: 5px;
    }

    p {
      font-size: 13px;
    }
  }
`;
