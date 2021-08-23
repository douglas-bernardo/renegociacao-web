import React from 'react';
import { Redirect, Switch } from 'react-router-dom';

import { useAuth } from '../hooks/auth';

import Route from './Route';
import SignIn from '../pages/SignIn';
import NewPasswordForm from '../pages/NewPasswordForm';
import Dashboard from '../pages/Dashboard/Default';
import DashboardAdmin from '../pages/Dashboard/Admin';

import NegotiationsAdmin from '../pages/Negotiations/Admin';
import Settings from '../pages/Settings';
import Users from '../pages/Users';
import UsersForm from '../pages/UserForm';
import Roles from '../pages/Roles';
import RolesForm from '../pages/RoleForm';

import Goals from '../pages/Goals';
import GoalsForm from '../pages/GoalForm';

import Occurrences from '../pages/Occurrences';
import OccurrenceDetails from '../pages/OccurrenceDetails';
import OccurrenceDetailsAdmin from '../pages/OccurrenceDetails/Admin';
import Negotiations from '../pages/Negotiations';
import NegotiationDetails from '../pages/NegotiationDetails';
import NegotiationDetailsAdmin from '../pages/NegotiationDetails/Admin';
import { useCan } from '../hooks/useCan';

const adminRoles = ['ROLE_ADMIN', 'ROLE_GERENTE', 'ROLE_COORDENADOR'];

const Routes: React.FC = () => {
  const { user } = useAuth();
  const userIsAdmin = useCan({ roles: adminRoles });

  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      {Number(user?.reset_password) && (
        <Route
          render={() => (
            <Redirect
              to={{
                pathname: '/',
              }}
            />
          )}
          exact
          component={NewPasswordForm}
          isPrivate
        />
      )}
      <Route
        path="/dashboard"
        exact
        component={userIsAdmin ? DashboardAdmin : Dashboard}
        isPrivate
      />

      {/* Common Routes */}
      <Route
        path="/occurrences/details"
        exact
        component={userIsAdmin ? OccurrenceDetailsAdmin : OccurrenceDetails}
        isPrivate
      />
      <Route path="/occurrences" exact component={Occurrences} isPrivate />

      <Route
        path="/negotiations/details"
        exact
        component={userIsAdmin ? NegotiationDetailsAdmin : NegotiationDetails}
        isPrivate
      />
      <Route
        path="/negotiations"
        exact
        component={userIsAdmin ? NegotiationsAdmin : Negotiations}
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
      <Route
        roles={['ROLE_ADMIN']}
        path="/settings/users/new"
        exact
        component={UsersForm}
        isPrivate
      />
      <Route
        roles={['ROLE_ADMIN']}
        path="/settings/users"
        exact
        component={Users}
        isPrivate
      />

      <Route
        roles={['ROLE_ADMIN']}
        path="/settings/roles/edit"
        exact
        component={RolesForm}
        isPrivate
      />
      <Route
        roles={['ROLE_ADMIN']}
        path="/settings/roles"
        exact
        component={Roles}
        isPrivate
      />

      <Route
        roles={['ROLE_ADMIN']}
        path="/settings/goals/new"
        exact
        component={GoalsForm}
        isPrivate
      />
      <Route
        roles={['ROLE_ADMIN']}
        path="/settings/goals/edit"
        exact
        component={GoalsForm}
        isPrivate
      />
      <Route
        roles={['ROLE_ADMIN']}
        path="/settings/goals"
        exact
        component={Goals}
        isPrivate
      />
      {/* Not Found */}
      <Route render={() => <Redirect to="/" />} exact component={SignIn} />
    </Switch>
  );
};

export default Routes;
