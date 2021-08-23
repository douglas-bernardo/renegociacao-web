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

import { Main, GoalsTable } from './styles';
import { api } from '../../services/api';
import BreadCrumb from '../../components/BreadCrumb';
import BreadCrumbItem from '../../components/BreadCrumbItem';

interface Goal {
  id: number;
  current_year: number;
  description: string;
  active: boolean;
  goal_type: {
    name: string;
  };
}

interface Response {
  status: string;
  data: Goal[];
}

const Roles: React.FC = () => {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [goals, setGoals] = useState<Goal[]>([]);
  const [totalGoals, setTotalGoals] = useState(0);

  useEffect(() => {
    api
      .get<Response>('/domain/goal', {
        params: {
          offset,
          limit,
        },
      })
      .then(response => {
        setTotalGoals(response.headers['x-total-count']);
        const { data } = response.data;
        setGoals(data);
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
              <BreadCrumbItem label="Metas" />
            </BreadCrumb>
          </MainHeader>
          <div className="pageUserControls">
            <Link to="/settings/goals/new">Novo</Link>
          </div>
          <GoalsTable>
            <thead>
              <tr>
                <th>Ano Vigência</th>
                <th>Tipo de Meta</th>
                <th>Descrição</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading &&
                goals.map(goal => (
                  <tr key={goal.id}>
                    <td>{goal.current_year}</td>
                    <td>{goal.goal_type.name}</td>
                    <td>{goal.description}</td>
                    <td>
                      <Link
                        data-tip
                        data-for="editButton"
                        to={{
                          pathname: `/settings/goals/edit`,
                          state: {
                            id: goal.id,
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
          </GoalsTable>
          {isLoading && <Loading />}
          {totalGoals > 0 && (
            <Pagination
              count={totalGoals}
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
