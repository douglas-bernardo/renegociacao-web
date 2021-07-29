import React, { useCallback } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';

import { Link } from 'react-router-dom';
import { FaRegEdit } from 'react-icons/fa';
import { BiReset } from 'react-icons/bi';
import ReactTooltip from 'react-tooltip';

import { Container, Content } from '../../components/Container';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import TagRoles from '../../components/TagRoles';
import LoadingModal from '../../components/LoadingModal';
import Loading from '../../components/Loading';
import ModalConfirm from '../../components/ModalConfirm';
import Pagination from '../../components/Pagination';
import Whoops from '../../components/Whoops';
import DialogBox from '../../components/DialogBox';

import { Main, MainHeader, UsersTable, ActionButton } from './styles';
import { api } from '../../services/api';
import { useToast } from '../../hooks/toast';
import BreadCrumb from '../../components/BreadCrumb';
import BreadCrumbItem from '../../components/BreadCrumbItem';

interface Role {
  id: number;
  name: string;
}

interface User {
  ativo: boolean;
  email: string;
  id: number;
  nome: string;
  primeiro_nome: string;
  ts_usuario_id: number;
  reset_password: boolean;
  roles: Role[];
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
  const { addToast } = useToast();
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);

  const [showMessageBox, setShowMessageBox] = useState(false);
  const [showLoadingModal, setLoadingModal] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tableRefresh, setTableRefresh] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);

  const [showModalConfirm, setShowModalConfirm] = useState(false);

  useEffect(() => {
    api
      .get<Response>('/users', {
        params: {
          offset,
          limit,
        },
      })
      .then(response => {
        setTotalUsers(response.headers['x-total-count']);
        const { data } = response.data;
        setUsers(data);
        setIsLoading(false);
      })
      .catch((error: Error) => {
        setIsLoading(false);
        setIsError(true);
        console.log(error.message);
      });
  }, [offset, limit, tableRefresh]);

  const handleOffsetAndLimit = useCallback(
    (_limit: number, _offset: number) => {
      setIsLoading(true);

      setLimit(_limit);
      setOffset(_offset);
    },
    [],
  );

  const handleRefreshPage = useCallback(() => {
    setTableRefresh(!tableRefresh);
    window.scrollTo(0, 0);
  }, [tableRefresh]);

  const toggleModalConfirm = useCallback(() => {
    setShowModalConfirm(!showModalConfirm);
  }, [showModalConfirm]);

  const handleResetPassword = useCallback(() => {
    toggleModalConfirm();
  }, [toggleModalConfirm]);

  const handleModalConfirmYes = useCallback(() => {
    toggleModalConfirm();
    setLoadingModal(true);
    api
      .put(`/users/${selectedUser?.id}/reset-password`)
      .then(() => {
        setLoadingModal(false);
        handleRefreshPage();
        setShowMessageBox(true);
      })
      .catch(error => {
        addToast({
          type: 'error',
          title: 'Não Permitido',
          description: error.response.data.message
            ? error.response.data.message
            : 'Erro na solicitação',
        });
      });
  }, [toggleModalConfirm, addToast, handleRefreshPage, selectedUser?.id]);

  const toggleMessageBox = useCallback(() => {
    setShowMessageBox(!showMessageBox);
  }, [showMessageBox]);

  return (
    <Container>
      <Sidebar />
      <LoadingModal isOpen={showLoadingModal} />
      <DialogBox
        title="Reset de Senha"
        message="A senha o do usuário foi redefinida com sucesso. Peça para o mesmo deslogar e logar novamente no sistema com a senha padrão: renegociacao"
        isOpen={showMessageBox}
        setIsOpen={toggleMessageBox}
      />
      <ModalConfirm
        title="Reset de Senha | Usuário"
        message={`O usuário precisará deslogar e logar novamente no sistema. Confirma o reset da senha do usuário ${selectedUser?.primeiro_nome}?`}
        confirmYes="Confirmar"
        confirmNo="Cancelar"
        isOpen={showModalConfirm}
        setIsOpen={toggleModalConfirm}
        handleConfirmYes={handleModalConfirmYes}
        buttonType={{
          theme: {
            confirmYes: 'success',
          },
        }}
      />
      <Content>
        <Header />
        <Main>
          <MainHeader>
            <BreadCrumb>
              <BreadCrumbItem link="/settings" label="Configurações" />
              <BreadCrumbItem label="Usuários" />
            </BreadCrumb>
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
                <th>Status</th>
                <th>Funções</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading &&
                users.map(user => (
                  <tr key={user.id} onClick={() => setSelectedUser(user)}>
                    <td>{user.primeiro_nome}</td>
                    <td>{user.nome}</td>
                    <td>{user.email}</td>
                    <td>{Number(user.ativo) ? 'Ativo' : 'Inativo'}</td>
                    <td>
                      <div className="roles">
                        {user.roles &&
                          user.roles.map(role => (
                            <TagRoles
                              key={role.id}
                              theme={rolesStyles[role.name] || 'ROLE_CONSULTOR'}
                            >
                              {role.name.replace('ROLE_', '')}
                            </TagRoles>
                          ))}
                      </div>
                    </td>
                    <td>
                      <ActionButton
                        isReseted={!!Number(user.reset_password)}
                        disabled={!!Number(user.reset_password)}
                        data-tip
                        data-for="resetPasswordButton"
                        type="button"
                        onClick={handleResetPassword}
                      >
                        <BiReset size={28} />
                        <ReactTooltip
                          id="resetPasswordButton"
                          type="info"
                          effect="solid"
                          delayShow={1000}
                        >
                          <span>Reset de Senha</span>
                        </ReactTooltip>
                      </ActionButton>
                      <Link
                        data-tip
                        data-for="editButton"
                        to={{
                          pathname: `/settings/users/edit`,
                          state: {
                            id: user.id,
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
          </UsersTable>
          {isLoading && <Loading />}
          {totalUsers > 0 && (
            <Pagination
              count={totalUsers}
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

export default Users;
