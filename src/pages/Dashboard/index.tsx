import React from 'react';

import { Container, Content } from '../../components/Container';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

import { Main } from './styles';

const Dashboard: React.FC = () => {
  return (
    <Container>
      <Sidebar />
      <Content>
        <Header />
        <Main>
          <h1>Dashboard Page</h1>
        </Main>
      </Content>
    </Container>
  );
};

export default Dashboard;
