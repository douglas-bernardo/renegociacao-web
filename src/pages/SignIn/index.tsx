import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FiMail, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { useHistory } from 'react-router-dom';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import getValidationErros from '../../utils/getValidationErros';

import logoImg from '../../assets/logo_vacation.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AnimationContainer, Background } from './styles';

interface SingInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const { signIn } = useAuth();
  const { addToast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isExpired = localStorage.getItem('@Renegociacao:expired');
    if (isExpired) {
      addToast({
        type: 'info',
        title: 'Sessão expirou',
        description: 'Sua sessão expirou! Por favor, faça login novamente.',
      });
      localStorage.removeItem('@Renegociacao:expired');
    }
  }, [addToast]);

  const handleSubmit = useCallback(
    async (data: SingInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().required('Senha é obrigatória'),
        });

        await schema.validate(data, { abortEarly: false });

        setIsLoading(true);

        await signIn({
          email: data.email,
          password: data.password,
        });

        history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErros(err);
          formRef.current?.setErrors(errors);
          return;
        }
        setIsLoading(false);
        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description: err.response?.data.message
            ? err.response.data.message
            : 'Erro na solicitação',
        });
      }
    },
    [signIn, addToast, history],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="RenegociacaoWeb" />
          <h1>Renegociação Web</h1>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu login</h1>

            <Input
              name="email"
              icon={FiMail}
              placeholder="E-mail"
              autoComplete="on"
            />

            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />

            <Button type="submit" loading={isLoading}>
              Entrar
            </Button>

            {/* <Link to="forgot-password">Esqueci minha conta</Link> */}
          </Form>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
