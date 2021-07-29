import React from 'react';
import { Link } from 'react-router-dom';

import { Container, Content, MainHeader } from '../../components/Container';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

import { Main, CardsContainer, SettingCard } from './styles';

import team from '../../assets/team.png';
import imports from '../../assets/import.png';
import target from '../../assets/target.png';
import roles from '../../assets/roles.png';

const Settings: React.FC = () => {
  return (
    <Container>
      <Sidebar />
      <Content>
        <Header />
        <Main>
          <MainHeader>
            <h1>Configurações</h1>
          </MainHeader>
          <CardsContainer>
            <SettingCard>
              <Link to="/settings/users">
                <img src={team} alt="team" />
                <div className="cardContent">
                  <h3>Usuários</h3>
                  <p>Gerencie sua equipe</p>
                </div>
              </Link>
            </SettingCard>
            <SettingCard>
              <Link to="/settings/imports">
                <img src={imports} alt="imports" />
                <div className="cardContent">
                  <h3>Importações</h3>
                  <p>Configure e acompanhe as importações do sistema</p>
                </div>
              </Link>
            </SettingCard>
            <SettingCard>
              <Link to="/settings/goals">
                <img src={target} alt="target" />
                <div className="cardContent">
                  <h3>Metas</h3>
                  <p>Defina as metas da equipe</p>
                </div>
              </Link>
            </SettingCard>
            <SettingCard>
              <Link to="/settings/roles">
                <img src={roles} alt="roles" />
                <div className="cardContent">
                  <h3>Funções</h3>
                  <p>Ajustes de funções/permissões de usuários</p>
                </div>
              </Link>
            </SettingCard>
          </CardsContainer>
        </Main>
      </Content>
    </Container>
  );
};

export default Settings;
