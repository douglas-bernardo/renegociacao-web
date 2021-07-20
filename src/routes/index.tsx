import React from 'react';

import AdminRoutes from './AdminRoutes';
import CommonUsersRoutes from './CommonUsersRoutes';

import { useAuth } from '../hooks/auth';

const Routes: React.FC = () => {
  const { user } = useAuth();
  return user?.roles.includes('ROLE_ADMIN') ? (
    <AdminRoutes />
  ) : (
    <CommonUsersRoutes />
  );
};

export default Routes;
