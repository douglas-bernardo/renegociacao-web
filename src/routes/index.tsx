import React, { useState } from 'react';
import { Redirect, Switch } from 'react-router-dom';

import { useEffect } from 'react';
import AdminRoutes from './AdminRoutes';
import CommonUsersRoutes from './CommonUsersRoutes';

import Route from './Route';
import SignIn from '../pages/SignIn';
import NewPasswordForm from '../pages/NewPasswordForm';
import Profile from '../pages/Profile';

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

  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/profile" exact component={Profile} isPrivate />
      {Number(user?.reset_password) && (
        <Route
          render={() => (
            <Redirect
              to={{
                pathname: '/new-password',
              }}
            />
          )}
          exact
          component={NewPasswordForm}
          isPrivate
        />
      )}
      {hasAdminRoutesPermissions ? <AdminRoutes /> : <CommonUsersRoutes />}
    </Switch>
  );
};

export default Routes;
