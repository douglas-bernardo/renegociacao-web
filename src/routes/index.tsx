import React from 'react';
import { Redirect, Switch } from 'react-router-dom';

import { useAuth } from '../hooks/auth';

import Route from './Route';
import SignIn from '../pages/SignIn';
import NewPasswordForm from '../pages/NewPasswordForm';
import Dashboard from '../pages/Dashboard';

import NegotiationsAdmin from '../pages/Negotiations/Admin';
import Settings from '../pages/Settings';
import Users from '../pages/Users';
import UsersForm from '../pages/UserForm';

import Occurrences from '../pages/Occurrences';
import OccurrenceDetails from '../pages/OccurrenceDetails';
import Negotiations from '../pages/Negotiations';
import NegotiationDetails from '../pages/NegotiationDetails';
import { useCan } from '../hooks/useCan';

const adminRoles = ['ROLE_ADMIN', 'ROLE_GERENTE', 'ROLE_COORDENADOR'];

const Routes: React.FC = () => {
  const { user } = useAuth();
  const userCanSeeRote = useCan({ roles: adminRoles });

  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
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
      <Route path="/dashboard" exact component={Dashboard} isPrivate />

      {/* Common Routes */}
      <Route
        path="/occurrences/details"
        exact
        component={OccurrenceDetails}
        isPrivate
      />
      <Route path="/occurrences" exact component={Occurrences} isPrivate />

      <Route
        path="/negotiations/details"
        exact
        component={NegotiationDetails}
        isPrivate
      />
      <Route
        path="/negotiations"
        exact
        component={userCanSeeRote ? NegotiationsAdmin : Negotiations}
        isPrivate
      />

      {/* admin routes */}

      <Route
        roles={['ROLE_ADMIN']}
        path="/settings"
        exact
        component={Settings}
        isPrivate
      />
      <Route
        roles={['ROLE_ADMIN']}
        path="/settings/users/edit"
        exact
        component={UsersForm}
        isPrivate
      />
      <Route path="/settings/users/new" exact component={UsersForm} isPrivate />
      <Route
        roles={['ROLE_ADMIN']}
        path="/settings/users"
        exact
        component={Users}
        isPrivate
      />

      {/* Not Found */}
      <Route render={() => <Redirect to="/" />} exact component={SignIn} />
    </Switch>
  );
};

export default Routes;
