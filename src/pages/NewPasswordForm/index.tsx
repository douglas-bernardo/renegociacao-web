import React, { useCallback, useRef, useState } from 'react';
import { FiArrowLeft, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { api } from '../../services/api';

import { useToast } from '../../hooks/toast';

import getValidationErros from '../../utils/getValidationErros';

import logoImg from '../../assets/logo_vacation.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AnimationContainer, Background } from './styles';
import { useAuth } from '../../hooks/auth';

interface ResetPasswordFormData {
  password: string;
  password_confirmation: string;
}

const NewPasswordForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const { user, signOut } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          password: Yup.string().min(6, 'No mínimo 6 digitos'),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'Confirmação incorreta',
          ),
        });

        await schema.validate(data, { abortEarly: false });
        const { password } = data;

        setIsLoading(true);

        await api.put(`/users/${user?.id}/create-password`, { password });

        signOut();

        addToast({
          type: 'success',
          title: 'Senha alterada com sucesso!',
          description: 'Você já pode realizar o login no sistema!',
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErros(err);
          formRef.current?.setErrors(errors);
          return;
        }
        setIsLoading(false);
        addToast({
          type: 'error',
          title: 'Erro na alteração da senha',
          description: err.response.data.message
            ? err.response.data.message
            : 'Erro na solicitação',
        });
      }
    },
    [addToast, user?.id, signOut],
  );

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="RenegociacaoWeb" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Alterar Senha</h1>
            <p>
              Você esta acessando o sistema pela primeira vez ou sua senha foi
              redefinida. Por favor registre uma nova senha
            </p>

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Nova senha"
            />

            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirmação de senha"
            />

            <Button type="submit" loading={isLoading}>
              Alterar senha
            </Button>
          </Form>

          <button
            className="backLogon"
            type="button"
            title="Log out"
            onClick={signOut}
          >
            <FiArrowLeft size={20} />
            Voltar para logon
          </button>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default NewPasswordForm;
