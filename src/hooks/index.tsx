import React from 'react';

import { AuthProvider } from './auth';
import { ToastProvider } from './toast';
import { NegotiationProvider } from './negotiation';

const AppProvider: React.FC = ({ children }) => (
  <ToastProvider>
    <AuthProvider>
      <NegotiationProvider>{children}</NegotiationProvider>
    </AuthProvider>
  </ToastProvider>
);

export default AppProvider;
