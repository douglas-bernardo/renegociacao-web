/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { ChangeEvent, useRef, useCallback } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { FaSearch } from 'react-icons/fa';
import { TiArrowLeftThick } from 'react-icons/ti';
import * as Yup from 'yup';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import Loader from 'react-loader-spinner';

import { useState } from 'react';
import { useEffect } from 'react';
import { useToast } from '../../hooks/toast';

import Loading from '../../components/Loading';
import { Container, Content, MainHeader } from '../../components/Container';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

import { Main, ContainerRegister, Form, RoleBoard } from './styles';
import getValidationErros from '../../utils/getValidationErros';
import Input from '../../components/Input';
import LoadingModal from '../../components/LoadingModal';
import { api, apiTimesharing } from '../../services/api';
import { OutSideClick } from '../../hooks/outSideClick';
import ToggleButton from '../../components/ToggleButton';
import BreadCrumb from '../../components/BreadCrumb';
import BreadCrumbItem from '../../components/BreadCrumbItem';

interface LocationProps {
  id?: number | undefined;
}

interface Role {
  id: number;
  name: string;
}

interface RolesResponse {
  status: string;
  data: Role[];
}

interface UserSystemTS {
  idpessoa: number;
  nome: string;
  idusuario: number;
  usuariots: string;
}

interface UserSystemResponse {
  status: string;
  data: UserSystemTS[];
}

interface User {
  id: number;
  nome: string;
  primeiro_nome: string;
  email: string;
  password: string;
  ativo: boolean;
  ts_usuario_id: number;
  usuariots: string;
  roles: Role[];
}

interface UserResponse {
  status: string;
  data: User;
}

const UserForm: React.FC = () => {
  const history = useHistory();
  const { visible, setVisible, ref } = OutSideClick(false);
  const { addToast } = useToast();
  const [showLoadingModal, setLoadingModal] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const location = useLocation<LocationProps>();
  const [roles, setRoles] = useState<Role[] | null>(null);

  const [isError, setIsError] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [userSystemTSResults, setUserSystemTSResults] = useState<
    UserSystemTS[]
  >([]);
  const [userRoles, setUserRoles] = useState<number[]>([]);
  const [user, setUser] = useState<User>({} as User);

  useEffect(() => {
    api.get<RolesResponse>('/domain/role').then(response => {
      const { data } = response.data;
      setRoles(data);
    });
  }, []);

  useEffect(() => {
    if (location.state?.id) {
      api.get<UserResponse>(`/users/${location.state?.id}`).then(response => {
        const { data: userData } = response.data;
        const currentUserEditRoles = userData.roles?.map(role => {
          return role.id;
        });
        setUserRoles(currentUserEditRoles ?? []);
        setUser(userData);
      });
    }
  }, [location.state?.id]);

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 3) return;
    apiTimesharing
      .get<UserSystemResponse>(`user-system`, {
        params: {
          query: searchTerm,
        },
      })
      .then(response => {
        const { data } = response.data;
        setUserSystemTSResults(data);
        setSearchLoading(false);
      })
      .catch((error: Error) => {
        setSearchLoading(false);
        setIsError(true);
        console.log(error.message);
      });
  }, [searchTerm]);

  const handleInputSearchUser = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.value || e.target.value.length < 3) {
        setVisible(false);
        setSearchLoading(false);
        setSearchTerm('');
        setUserSystemTSResults([]);
        return;
      }
      setSearchTerm(e.target.value.toUpperCase());
      setVisible(true);
      setSearchLoading(true);
      setIsError(false);
    },
    [setVisible],
  );

  const handleSelectUserSystemTS = useCallback(
    (selected: UserSystemTS) => {
      setUser({
        ...user,
        ts_usuario_id: selected.idusuario,
      });
      formRef.current?.setData({
        usuariots: selected.usuariots,
        nome: selected.nome,
        primeiro_nome: selected.nome.split(' ')[0],
      });
      setVisible(false);
    },
    [setVisible, user],
  );

  const handleButtonSubmit = useCallback(() => {
    formRef.current?.submitForm();
  }, []);

  const handleSubmit = useCallback(
    async (data: User) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          usuariots: Yup.string().required('Usuário TS é obrigatório'),
          nome: Yup.string().required('Nome é obrigatório'),
          primeiro_nome: Yup.string().required('Nome exibição é obrigatório'),
          email: Yup.string().required('E-mail é obrigatório'),
        });

        await schema.validate(data, { abortEarly: false });

        setLoadingModal(true);

        const userData = {
          ...user,
          ...data,
          roles: userRoles,
        };

        if (location.state?.id) {
          await api.put(`/users/${location.state.id}`, userData);
        } else {
          await api.post('/users', userData);
        }

        setLoadingModal(false);
        addToast({
          type: 'success',
          title: 'Cadastro Usuário',
          description: location.state?.id
            ? 'Dados alterados com sucesso'
            : 'Usuário cadastrado com sucesso',
        });

        history.push('/settings/users');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErros(err);
          formRef.current?.setErrors(errors);
          return;
        }
        setLoadingModal(false);
        addToast({
          type: 'error',
          title: `Não Permitido`,
          description: err.response.data.message
            ? err.response.data.message
            : 'Erro na solicitação',
        });
        window.scrollTo(0, 0);
      }
    },
    [addToast, user, location.state?.id, userRoles, history],
  );

  const handleAddRolesUser = useCallback(
    (selected: any) => {
      if (userRoles.includes(selected.option.role_id)) {
        setUserRoles(
          userRoles.filter(item => item !== selected.option.role_id),
        );
        return;
      }
      setUserRoles(prevRoleIds => [...prevRoleIds, selected.option.role_id]);
    },
    [userRoles],
  );

  const handleActivateDeActivateUser = useCallback(() => {
    setUser({
      ...user,
      ativo: !Number(user.ativo),
    });
  }, [user]);

  return (
    <Container>
      <Sidebar />
      <Content>
        <LoadingModal isOpen={showLoadingModal} />
        <Header />
        <Main>
          <MainHeader>
            <BreadCrumb>
              <BreadCrumbItem link="/settings" label="Configurações" />
              <BreadCrumbItem link="/settings/users" label="Usuários" />
              <BreadCrumbItem label={location.state?.id ? 'Editar' : 'Novo'} />
            </BreadCrumb>
          </MainHeader>
          <div className="linkBackPage">
            <Link to="/settings/users/">
              <TiArrowLeftThick size={25} />
              <span>Voltar</span>
            </Link>
          </div>
          {!roles ? (
            <Loading />
          ) : (
            <ContainerRegister>
              <Form ref={formRef} onSubmit={handleSubmit}>
                <div className="row userTimesharing">
                  <div className="label">Usuário Timesharing:</div>
                  <div className="searchUserTimesharing">
                    <Input
                      mask="toUpper"
                      name="usuariots"
                      onChange={handleInputSearchUser}
                      defaultValue={user.usuariots}
                    />
                    <FaSearch size={35} />
                    <div ref={ref}>
                      {visible > 0 && (
                        <div className="containerResults">
                          {searchLoading ? (
                            <Loader
                              type="ThreeDots"
                              color="#003379"
                              height={30}
                              width={30}
                            />
                          ) : (
                            <ul>
                              {userSystemTSResults.map(item => (
                                <li
                                  key={item.idusuario}
                                  className="listItem"
                                  onClick={() => {
                                    handleSelectUserSystemTS(item);
                                  }}
                                >
                                  {item.usuariots}
                                </li>
                              ))}
                            </ul>
                          )}
                          {isError && (
                            <p>Erro ao buscar usuário no Timesharing.</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="label">Nome Completo:</div>
                  <Input name="nome" defaultValue={user.nome} />
                </div>

                <div className="row">
                  <div className="label">Nome Exibição:</div>
                  <Input
                    name="primeiro_nome"
                    defaultValue={user.primeiro_nome}
                  />
                </div>

                <div className="row">
                  <div className="label">E-mail Beach Park:</div>
                  <Input
                    name="email"
                    placeholder="@beachpark.com.br"
                    defaultValue={user.email}
                  />
                </div>
                {location.state?.id && (
                  <div className="row">
                    <div className="label">Ativo:</div>
                    <ToggleButton
                      selected={!!Number(user.ativo)}
                      onChange={handleActivateDeActivateUser}
                    />
                  </div>
                )}
              </Form>
              <RoleBoard>
                <header>
                  <p>Selecione as funções que deseja atribuir ao usuário:</p>
                </header>
                <main>
                  {roles.map(role => (
                    <div key={role.id} className="roleItem">
                      <ToggleButton
                        option={{ role_id: role.id }}
                        selected={userRoles.includes(role.id)}
                        onChange={handleAddRolesUser}
                      />
                      <p>{role.name}</p>
                    </div>
                  ))}
                </main>
              </RoleBoard>
              <button
                type="button"
                className="userSubmit"
                data-test-id="add-waiter-button"
                onClick={handleButtonSubmit}
              >
                <p className="text">Salvar</p>
              </button>
            </ContainerRegister>
          )}
        </Main>
      </Content>
    </Container>
  );
};

export default UserForm;
