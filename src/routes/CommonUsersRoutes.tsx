import React from 'react';
import { Redirect, Switch } from 'react-router-dom';

import Route from './Route';

import Dashboard from '../pages/Dashboard';
import Occurrences from '../pages/Occurrences';
import OccurrenceDetails from '../pages/OccurrenceDetails';
import Negotiations from '../pages/Negotiations';
import NegotiationDetails from '../pages/NegotiationDetails';
import SignIn from '../pages/SignIn';

const CommonUsersRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/dashboard" exact component={Dashboard} isPrivate />
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
      <Route path="/negotiations" exact component={Negotiations} isPrivate />
      <Route render={() => <Redirect to="/" />} exact component={SignIn} />
    </Switch>
  );
};

export default CommonUsersRoutes;
