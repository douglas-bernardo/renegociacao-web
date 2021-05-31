import React from 'react';

import { AuthProvider } from './auth';
import { ToastProvider } from './toast';
import { NegotiationProvider } from './negotiation';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <ToastProvider>
      <NegotiationProvider>{children}</NegotiationProvider>
    </ToastProvider>
  </AuthProvider>
);

export default AppProvider;
