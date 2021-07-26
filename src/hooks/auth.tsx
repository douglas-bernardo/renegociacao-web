import React, { createContext, useCallback, useContext, useState } from 'react';
import { useEffect } from 'react';
import { api } from '../services/api';

import { useToast } from './toast';

interface Role {
  id: number;
  name: string;
}

export interface User {
  ativo: boolean;
  email: string;
  id: number;
  nome: string;
  primeiro_nome: string;
  ts_usuario_id: number;
  reset_password: boolean;
  roles: Role[];
  permissions: string[];
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
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  updateUser: (user: User) => void;
}

interface AuthResponse {
  status: string;
  user: User;
  token: string;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

let authChannel: BroadcastChannel;

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

  const signOut = useCallback(() => {
    localStorage.removeItem('@Renegociacao:token');
    localStorage.removeItem('@Renegociacao:user');

    authChannel.postMessage('signOut');

    setData({} as AuthState);
  }, []);

  useEffect(() => {
    authChannel = new BroadcastChannel('auth');

    authChannel.onmessage = (message: MessageEvent) => {
      switch (message.data) {
        case 'signOut':
          signOut();
          break;

        default:
          break;
      }
    };
  }, [signOut]);

  const signIn = useCallback(
    async ({ email, password }) => {
      const response = await api.post<AuthResponse>('sessions', {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem('@Renegociacao:token', token);
      localStorage.setItem('@Renegociacao:user', JSON.stringify(user));

      api.defaults.headers.authorization = `Bearer ${token}`;

      if (user && !Number(user.reset_password)) {
        addToast({
          type: 'success',
          title: `Olá ${user.primeiro_nome} Bem Vindo(a)!`,
        });
      }

      setData({ token, user });
    },
    [addToast],
  );

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
