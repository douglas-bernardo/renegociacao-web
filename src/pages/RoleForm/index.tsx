import React, { useRef, useCallback } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { FormHandles } from '@unform/core';
import { TiArrowLeftThick } from 'react-icons/ti';
import * as Yup from 'yup';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import { useState } from 'react';
import { useEffect } from 'react';
import { useToast } from '../../hooks/toast';

import Loading from '../../components/Loading';
import { Container, Content, MainHeader } from '../../components/Container';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

import { Main, ContainerRegister, Form, PermissionsBoard } from './styles';
import { getValidationErrors } from '../../utils/getValidationErrors';
import Input from '../../components/Input';
import LoadingModal from '../../components/LoadingModal';
import { api } from '../../services/api';
import ToggleButton from '../../components/ToggleButton';
import BreadCrumb from '../../components/BreadCrumb';
import BreadCrumbItem from '../../components/BreadCrumbItem';

interface LocationProps {
  id?: number | undefined;
}

interface Permission {
  id: number;
  name: string;
  description: string;
  key_word: string;
}

interface Role {
  id: number;
  name: string;
  alias: string;
  description: string;
  permissions: Permission[];
}

interface RoleResponse {
  status: string;
  data: Role;
}

interface PermissionResponse {
  status: string;
  data: Permission[];
}

const RoleForm: React.FC = () => {
  const history = useHistory();
  const { addToast } = useToast();
  const [showLoadingModal, setLoadingModal] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const location = useLocation<LocationProps>();

  const [permissions, setPermissions] = useState<Permission[] | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [currentPermissionsRole, setCurrentPermissionsRole] = useState<
    number[]
  >([]);

  useEffect(() => {
    api.get<PermissionResponse>('/domain/permission').then(response => {
      const { data } = response.data;
      setPermissions(data);
    });
  }, []);

  useEffect(() => {
    if (location.state?.id) {
      api
        .get<RoleResponse>(`/domain/role/${location.state?.id}`)
        .then(response => {
          const { data } = response.data;
          setCurrentPermissionsRole(
            data.permissions.map(permission => {
              return permission.id;
            }),
          );
          setRole(data);
        });
    }
  }, [location.state?.id]);

  const handleButtonSubmit = useCallback(() => {
    formRef.current?.submitForm();
  }, []);

  const handleSubmit = useCallback(
    async (data: Role) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          description: Yup.string().min(
            5,
            'Necessário descrição com no mínimo 5 dígitos',
          ),
        });

        await schema.validate(data, { abortEarly: false });

        setLoadingModal(true);

        await api.put(`/domain/role/${location.state.id}`, {
          description: data.description,
          permissions: currentPermissionsRole,
        });

        setLoadingModal(false);
        addToast({
          type: 'success',
          title: 'Cargos e Funções',
          description: 'Dados alterados com sucesso',
        });

        history.push('/settings/roles');
      } catch (err: any | Yup.ValidationError) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
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
    [addToast, location.state?.id, currentPermissionsRole, history],
  );

  const handleAddPermissionRole = useCallback(
    (selected: any) => {
      if (currentPermissionsRole.includes(selected.option.permission_id)) {
        setCurrentPermissionsRole(
          currentPermissionsRole.filter(
            item => item !== selected.option.permission_id,
          ),
        );
        return;
      }
      setCurrentPermissionsRole(prevRoleIds => [
        ...prevRoleIds,
        selected.option.permission_id,
      ]);
    },
    [currentPermissionsRole],
  );

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
              <BreadCrumbItem link="/settings/roles" label="Funções" />
              <BreadCrumbItem label="Editar" />
            </BreadCrumb>
          </MainHeader>
          <div className="linkBackPage">
            <Link to="/settings/roles">
              <TiArrowLeftThick size={25} />
              <span>Voltar</span>
            </Link>
          </div>
          {!permissions ? (
            <Loading />
          ) : (
            <ContainerRegister>
              <Form ref={formRef} onSubmit={handleSubmit}>
                <div className="row">
                  <div className="label">Cargo/Função:</div>
                  <Input
                    dataTestId="input-role"
                    name="name"
                    defaultValue={role?.name}
                    disabled
                  />
                </div>

                <div className="row">
                  <div className="label">Palavra Chave:</div>
                  <Input
                    dataTestId="input-role"
                    name="alias"
                    defaultValue={role?.alias}
                    disabled
                  />
                </div>

                <div className="row">
                  <div className="label">Descrição:</div>
                  <Input name="description" defaultValue={role?.description} />
                </div>
              </Form>
              <PermissionsBoard>
                <header>
                  <p>
                    Selecione as permissões que deseja atribuir ao cargo/função:
                  </p>
                </header>
                <main>
                  {permissions.map(permission => (
                    <div key={permission.id} className="roleItem">
                      <div className="toggleButtonContainer">
                        <ToggleButton
                          option={{ permission_id: permission.id }}
                          selected={role?.permissions.some(item => {
                            return item.id === permission.id;
                          })}
                          onChange={handleAddPermissionRole}
                        />
                      </div>
                      <p>{permission.name}</p>
                    </div>
                  ))}
                </main>
              </PermissionsBoard>
              <button
                type="button"
                className="roleSubmit"
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

export default RoleForm;
