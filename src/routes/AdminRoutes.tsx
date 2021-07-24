import React from 'react';
import { Redirect, Switch } from 'react-router-dom';

import Route from './Route';

import Dashboard from '../pages/Dashboard';
import OccurrenceDetails from '../pages/OccurrenceDetails/Admin';
import NegotiationDetails from '../pages/NegotiationDetails/Admin';
import Occurrences from '../pages/Occurrences/Admin';
import Negotiations from '../pages/Negotiations/Admin';
import Settings from '../pages/Settings';
import Users from '../pages/Users';
import UsersForm from '../pages/UserForm';
import SignIn from '../pages/SignIn';

const AdminRoutes: React.FC = () => (
  <Switch>
    <Route path="/dashboard" exact component={Dashboard} isPrivate />
    <Route
      path="/occurrences/details"
      exact
      component={OccurrenceDetails}
      isPrivate
    />
    <Route
      path="/negotiations/details"
      exact
      component={NegotiationDetails}
      isPrivate
    />
    <Route path="/occurrences" exact component={Occurrences} isPrivate />
    <Route path="/negotiations" exact component={Negotiations} isPrivate />
    <Route path="/settings" exact component={Settings} isPrivate />
    <Route path="/settings/users" exact component={Users} isPrivate />
    <Route path="/settings/users/new" exact component={UsersForm} isPrivate />
    <Route path="/settings/users/edit" exact component={UsersForm} isPrivate />
    <Route render={() => <Redirect to="/" />} exact component={SignIn} />
  </Switch>
);

export default AdminRoutes;
