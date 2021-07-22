import React, { useState } from 'react';

import { useEffect } from 'react';
import AdminRoutes from './AdminRoutes';
import CommonUsersRoutes from './CommonUsersRoutes';

import { useAuth } from '../hooks/auth';

const Routes: React.FC = () => {
  const { user } = useAuth();
  const [hasAdminRoutesPermissions, setHasAdminRoutesPermissions] = useState(
    false,
  );

  useEffect(() => {
    const adminRoles = ['ROLE_ADMIN', 'ROLE_GERENTE', 'ROLE_COORDENADOR'];
    const userRoles: string[] = user?.roles.map(role => {
      return role.name;
    });
    const hasRoles =
      userRoles &&
      userRoles.some(role => {
        return adminRoles.includes(role);
      });
    setHasAdminRoutesPermissions(hasRoles);
  }, [user?.roles]);

  return hasAdminRoutesPermissions ? <AdminRoutes /> : <CommonUsersRoutes />;
};

export default Routes;
