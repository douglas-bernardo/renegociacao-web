import React, { createContext, useCallback, useContext, useState } from 'react';
import { api } from '../services/api';

import { useToast } from './toast';

interface User {
  ativo: boolean;
  email: string;
  id: number;
  nome: string;
  primeiro_nome: string;
  ts_usuario_id: number;
  roles: String[];
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  token: string;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): void;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export const AuthProvider: React.FC = ({ children }) => {
  const { addToast } = useToast();

  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem('@Renegociacao:token');
    const user = localStorage.getItem('@Renegociacao:user');

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(
    async ({ email, password }) => {
      const response = await api.post('sessions', {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem('@Renegociacao:token', token);
      localStorage.setItem('@Renegociacao:user', JSON.stringify(user));

      api.defaults.headers.authorization = `Bearer ${token}`;

      if (user) {
        addToast({
          type: 'success',
          title: `Olá ${user.primeiro_nome} Bem Vindo(a)!`,
        });
      }

      setData({ token, user });
    },
    [addToast],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem('@Renegociacao:token');
    localStorage.removeItem('@Renegociacao:user');

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem('@Renegociacao:user', JSON.stringify(user));
      setData({
        token: data.token,
        user,
      });
    },
    [setData, data.token],
  );

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        token: data.token,
        signIn,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
