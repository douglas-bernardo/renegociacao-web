import React from 'react';

import { Container } from '../../components/Container';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

import { Content, Main } from './styles';

const Dashboard: React.FC = () => {
  return (
    <Container>
      <Sidebar />
      <Content>
        <Header />
        <Main />
      </Content>
    </Container>
  );
};

export default Dashboard;
