import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

import { Link } from 'react-router-dom';
import { FaRegEdit } from 'react-icons/fa';

import { Container, Content, MainHeader } from '../../components/Container';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import TagRoles from '../../components/TagRoles';

import { Main, UsersTable } from './styles';
import { api } from '../../services/api';
import Loading from '../../components/Loading';

interface User {
  id: number;
  ativo: boolean;
  primeiro_nome: string;
  nome: string;
  email: string;
  roles: String[];
}

interface Response {
  status: string;
  data: User[];
}

const rolesStyles = {
  ROLE_ADMIN: 'role_admin',
  ROLE_GERENTE: 'role_gerente',
  ROLE_COORDENADOR: 'role_coordenador',
  ROLE_SUPERVISOR: 'role_supervisor',
  ROLE_CONSULTOR: 'role_consultor',
};

const Users: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api
      .get<Response>('/users')
      .then(response => {
        const { data } = response.data;
        setUsers(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.log(err.message);
      });
  }, []);
  return (
    <Container>
      <Sidebar />
      <Content>
        <Header />
        <Main>
          <MainHeader>
            <h1>Configurações | Usuários </h1>
          </MainHeader>
          <div className="pageUserControls">
            <Link to="/settings/users/new">Novo</Link>
          </div>
          <UsersTable>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Nome Completo</th>
                <th>E-mail</th>
                <th>Funções</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users &&
                users.map(user => (
                  <tr key={user.id}>
                    <td>{user.primeiro_nome}</td>
                    <td>{user.nome}</td>
                    <td>{user.email}</td>
                    <td>
                      <div className="roles">
                        {user.roles &&
                          user.roles.map(role => (
                            <TagRoles
                              key={role.toString()}
                              theme={
                                rolesStyles[role.toString()] || 'ROLE_CONSULTOR'
                              }
                            >
                              {role.replace('ROLE_', '')}
                            </TagRoles>
                          ))}
                      </div>
                    </td>
                    <td>
                      <Link
                        to={{
                          pathname: `/settings/users/edit`,
                          state: {
                            id: user.id,
                          },
                        }}
                      >
                        <FaRegEdit size={28} />
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </UsersTable>
          {isLoading && <Loading />}
        </Main>
      </Content>
    </Container>
  );
};

export default Users;
