import React from 'react';

import { Container, Content } from '../../components/Container';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

import { Main } from './styles';
import Tabs from '../../components/Tabs';
import Tab from '../../components/Tab';

const Negociacoes: React.FC = () => {
  return (
    <Container>
      <Sidebar />
      <Content>
        <Header />
        <Main>
          <h1>Negociações Page</h1>
          <Tabs>
            <Tab title="Lemon">Lemon</Tab>
            <Tab title="Strawberry">Strawberry</Tab>
            <Tab title="Pear">Pear</Tab>
          </Tabs>
        </Main>
      </Content>
    </Container>
  );
};

export default Negociacoes;
