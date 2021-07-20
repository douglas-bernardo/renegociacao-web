/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { ChangeEvent, useRef, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { FaSearch } from 'react-icons/fa';
import * as Yup from 'yup';

import { useState } from 'react';
import { useEffect } from 'react';
import { useToast } from '../../hooks/toast';

import { Container, Content, MainHeader } from '../../components/Container';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

import { Main, ContainerRegister, Form } from './styles';
import getValidationErros from '../../utils/getValidationErros';
import Tabs from '../../components/Tabs';
import Tab from '../../components/Tab';
import Input from '../../components/Input';
import LoadingModal from '../../components/LoadingModal';
import { api, apiTimesharing } from '../../services/api';
import { OutSideClick } from '../../hooks/outSideClick';

interface LocationProps {
  id?: number | undefined;
}

interface UserSystem {
  idpessoa: number;
  nome: string;
  email: string;
  idusuario: number;
  usuariots: string;
}

interface User {
  user_timesharing: string;
  primeiro_nome: string;
  nome: string;
  email: string;
  password: string;
  ts_usuario_id: number;
}

interface Response {
  status: string;
  data: UserSystem[];
}

const UserForm: React.FC = () => {
  const history = useHistory();
  const { visible, setVisible, ref } = OutSideClick(false);
  const { addToast } = useToast();
  const [showLoadingModal, setLoadingModal] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const location = useLocation<LocationProps>();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserSystem[]>([]);
  const [
    selectedUserResult,
    setSelectedUserResult,
  ] = useState<UserSystem | null>(null);

  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (!searchTerm || searchTerm.length < 3) return;
    apiTimesharing
      .get<Response>(`user-system`, {
        params: {
          query: searchTerm,
        },
      })
      .then(response => {
        const { data } = response.data;
        setSearchResults(data);
      });
  }, [searchTerm]);

  const handleInputSearchUser = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.value || e.target.value.length < 3) {
        setVisible(false);
        setSearchTerm('');
        setSearchResults([]);
        return;
      }
      setSearchTerm(e.target.value.toUpperCase());
      setVisible(true);
    },
    [setVisible],
  );

  const handleSelectItem = useCallback(
    (item: UserSystem) => {
      setSelectedUserResult(item);
      formRef.current?.setData({
        user_timesharing: item.usuariots,
        name: item.nome,
        display_name: item.nome.split(' ')[0],
      });
      setVisible(false);
    },
    [setVisible],
  );

  const handleButtonSubmit = useCallback(() => {
    formRef.current?.submitForm();
  }, []);

  const handleSubmit = useCallback(
    async (data: User) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          user_timesharing: Yup.string().required('Usuário TS é obrigatório'),
          nome: Yup.string().required('Nome é obrigatório'),
          primeiro_nome: Yup.string().required('Nome exibição é obrigatório'),
          email: Yup.string().required('E-mail é obrigatório'),
        });

        await schema.validate(data, { abortEarly: false });

        const user = {
          ...data,
          ts_usuario_id: selectedUserResult?.idusuario,
          password: '123456',
        };

        setLoadingModal(true);
        await api.post('/users', user);

        setLoadingModal(false);
        addToast({
          type: 'success',
          title: 'Cadastro Usuário',
          description: 'Usuário cadastrado com sucesso',
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
          title: 'Não Permitido',
          description: err.response.data.message
            ? err.response.data.message
            : 'Erro na solicitação',
        });
      }
    },
    [addToast, selectedUserResult?.idusuario, history],
  );

  return (
    <Container>
      <Sidebar />
      <Content>
        <LoadingModal isOpen={showLoadingModal} />
        <Header />
        <Main>
          <MainHeader>
            <h1>
              {`Configurações | Usuários | ${
                location.state?.id ? 'Editar' : 'Novo'
              }`}
            </h1>
          </MainHeader>
          <ContainerRegister>
            <Tabs>
              <Tab title="Dados de Cadastro">
                <Form ref={formRef} onSubmit={handleSubmit}>
                  <div className="row userTimesharing">
                    <div className="label">Usuário Timesharing:</div>
                    <div className="searchUserTimesharing">
                      <Input
                        mask="toUpper"
                        name="user_timesharing"
                        onChange={handleInputSearchUser}
                        defaultValue={selectedUserResult?.usuariots}
                      />
                      <FaSearch size={35} />
                      <div ref={ref}>
                        {visible > 0 && (
                          <div className="containerResults">
                            <ul>
                              {searchResults.map(item => (
                                <li
                                  key={item.idusuario}
                                  className="listItem"
                                  onClick={() => handleSelectItem(item)}
                                >
                                  {item.usuariots}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="label">Nome Completo:</div>
                    <Input
                      name="nome"
                      defaultValue={selectedUserResult?.nome}
                    />
                  </div>

                  <div className="row">
                    <div className="label">Nome Exibição:</div>
                    <Input
                      name="primeiro_nome"
                      defaultValue={selectedUserResult?.nome.split(' ')[0]}
                    />
                  </div>

                  <div className="row">
                    <div className="label">E-mail Beach Park:</div>
                    <Input
                      name="email"
                      placeholder="@beachpark.com.br"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setUserEmail(e.target.value);
                      }}
                      defaultValue={userEmail}
                    />
                  </div>
                </Form>
              </Tab>
              <Tab title="Funções/Permissões" />
            </Tabs>
            <button
              type="button"
              className="userSubmit"
              data-test-id="add-waiter-button"
              onClick={handleButtonSubmit}
            >
              <p className="text">Salvar</p>
            </button>
          </ContainerRegister>
        </Main>
      </Content>
    </Container>
  );
};

export default UserForm;
