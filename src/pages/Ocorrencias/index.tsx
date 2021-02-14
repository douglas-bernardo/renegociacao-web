import React from 'react';

import { Container } from '../../components/Container';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Content, Main } from './styles';

const Ocorrencias: React.FC = () => {
  return (
    <Container>
      <Sidebar />
      <Content>
        <Header />
        <Main>
          <h1>Ocorrências Page</h1>
        </Main>
      </Content>
    </Container>
  );
};

export default Ocorrencias;
