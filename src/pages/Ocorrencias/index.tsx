import React from 'react';

import { Container, Content } from '../../components/Container';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import DropAction from '../../components/DropAction';

import { Main, MainHeader, OcorrenciasTable, StatusSituacao } from './styles';

const Ocorrencias: React.FC = () => {
  const situacao = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];

  return (
    <Container>
      <Sidebar />
      <Content>
        <Header>
          <input type="text" className="search-bar" placeholder="Pesquisar" />
        </Header>
        <Main>
          <MainHeader>
            <h1>Ocorrências</h1>
          </MainHeader>
          <OcorrenciasTable>
            <thead>
              <tr>
                <th>Número</th>
                <th>Cliente</th>
                <th>Projeto-Contrato</th>
                <th colSpan={2}>Situação</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>212931</td>
                <td className="clientName">
                  ANA PAULA DA COSTA RIBEIRO CESIDIO COUTO - VC
                </td>
                <td>183-876805000071</td>
                <td>
                  <StatusSituacao theme="warning">
                    Aguardando Retorno
                  </StatusSituacao>
                </td>
                <td>
                  <DropAction situacao={situacao} />
                </td>
              </tr>
              <tr>
                <td>212931</td>
                <td>ANA PAULA DA COSTA RIBEIRO CESIDIO COUTO - VC</td>
                <td>183-876805000071</td>
                <td>
                  <StatusSituacao theme="success">Retido</StatusSituacao>
                </td>
                <td>
                  <DropAction situacao={situacao} />
                </td>
              </tr>
              <tr>
                <td>212931</td>
                <td>ANA PAULA DA COSTA RIBEIRO CESIDIO COUTO - VC</td>
                <td>183-876805000071</td>
                <td>
                  <StatusSituacao theme="info">Revertido</StatusSituacao>
                </td>
                <td>
                  <DropAction situacao={situacao} />
                </td>
              </tr>
              <tr>
                <td>212931</td>
                <td>ANA PAULA DA COSTA RIBEIRO CESIDIO COUTO - VC</td>
                <td>183-876805000071</td>
                <td>
                  <StatusSituacao theme="default">Cancelado</StatusSituacao>
                </td>
                <td>
                  <DropAction situacao={situacao} />
                </td>
              </tr>
              <tr>
                <td>212931</td>
                <td>ANA PAULA DA COSTA RIBEIRO CESIDIO COUTO - VC</td>
                <td>183-876805000071</td>
                <td>
                  <StatusSituacao theme="warning">
                    Aguardando Retorno
                  </StatusSituacao>
                </td>
                <td>
                  <DropAction situacao={situacao} />
                </td>
              </tr>
              <tr>
                <td>212931</td>
                <td>ANA PAULA DA COSTA RIBEIRO CESIDIO COUTO - VC</td>
                <td>183-876805000071</td>
                <td>
                  <StatusSituacao theme="default">
                    Sol. de Informação
                  </StatusSituacao>
                </td>
                <td>
                  <DropAction situacao={situacao} />
                </td>
              </tr>
            </tbody>
          </OcorrenciasTable>
        </Main>
      </Content>
    </Container>
  );
};

export default Ocorrencias;
