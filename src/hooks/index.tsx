import React from 'react';

import { AuthProvider } from './auth';
import { ToastProvider } from './toast';
import { NegociacaoProvider } from './negociacao';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <ToastProvider>
      <NegociacaoProvider>{children}</NegociacaoProvider>
    </ToastProvider>
  </AuthProvider>
);

export default AppProvider;
