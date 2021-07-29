import React, { useCallback } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

import { Link } from 'react-router-dom';
import { FaRegEdit } from 'react-icons/fa';
import ReactTooltip from 'react-tooltip';

import { Container, Content, MainHeader } from '../../components/Container';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Loading from '../../components/Loading';
import Pagination from '../../components/Pagination';
import Whoops from '../../components/Whoops';

import { Main, RolesTable } from './styles';
import { api } from '../../services/api';
import BreadCrumb from '../../components/BreadCrumb';
import BreadCrumbItem from '../../components/BreadCrumbItem';

interface Permission {
  id: number;
}

interface Role {
  id: number;
  name: string;
  alias: string;
  description: string;
  permissions: Permission[];
}

interface Response {
  status: string;
  data: Role[];
}

const Roles: React.FC = () => {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [roles, setRoles] = useState<Role[]>([]);
  const [totalRoles, setTotalRoles] = useState(0);

  useEffect(() => {
    api
      .get<Response>('/domain/role', {
        params: {
          offset,
          limit,
        },
      })
      .then(response => {
        setTotalRoles(response.headers['x-total-count']);
        const { data } = response.data;
        setRoles(data);
        setIsLoading(false);
      })
      .catch((error: Error) => {
        setIsLoading(false);
        setIsError(true);
        console.log(error.message);
      });
  }, [offset, limit]);

  const handleOffsetAndLimit = useCallback(
    (_limit: number, _offset: number) => {
      setIsLoading(true);

      setLimit(_limit);
      setOffset(_offset);
    },
    [],
  );

  return (
    <Container>
      <Sidebar />
      <Content>
        <Header />
        <Main>
          <MainHeader>
            <BreadCrumb>
              <BreadCrumbItem link="/settings" label="Configurações" />
              <BreadCrumbItem label="Funções" />
            </BreadCrumb>
          </MainHeader>
          <RolesTable>
            <thead>
              <tr>
                <th>Cargo</th>
                <th>Palavra Chave</th>
                <th>Descrição</th>
                <th>Total de Permissões</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading &&
                roles.map(role => (
                  <tr key={role.id}>
                    <td>{role.name}</td>
                    <td>{role.alias}</td>
                    <td>{role.description}</td>
                    <td>{`${role.permissions.length} Permissões`}</td>
                    <td>
                      <Link
                        data-tip
                        data-for="editButton"
                        to={{
                          pathname: `/settings/roles/edit`,
                          state: {
                            id: role.id,
                          },
                        }}
                      >
                        <FaRegEdit size={28} />
                      </Link>
                      <ReactTooltip
                        id="editButton"
                        type="info"
                        effect="solid"
                        delayShow={1000}
                      >
                        <span>Editar</span>
                      </ReactTooltip>
                    </td>
                  </tr>
                ))}
            </tbody>
          </RolesTable>
          {isLoading && <Loading />}
          {totalRoles > 0 && (
            <Pagination
              count={totalRoles}
              limit={limit}
              pageRangeDisplayed={5}
              onChange={handleOffsetAndLimit}
            />
          )}
          {isError && <Whoops />}
        </Main>
      </Content>
    </Container>
  );
};

export default Roles;
