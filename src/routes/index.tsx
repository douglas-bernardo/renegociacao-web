import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

import Profile from '../pages/Profile';
import Dashboard from '../pages/Dashboard';
import Occurrences from '../pages/Occurrences';
import OccurrenceDetails from '../pages/OccurrenceDetails';

import Negotiations from '../pages/Negotiations';
import NegotiationDetails from '../pages/NegotiationDetails';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/signup" exact component={SignUp} />

    <Route path="/profile" exact component={Profile} isPrivate />
    <Route path="/dashboard" exact component={Dashboard} isPrivate />

    <Route path="/occurrences" exact component={Occurrences} isPrivate />
    <Route
      path="/occurrences/:id"
      exact
      component={OccurrenceDetails}
      isPrivate
    />
    <Route path="/negotiations" exact component={Negotiations} isPrivate />
    <Route
      path="/negotiations/:id"
      exact
      component={NegotiationDetails}
      isPrivate
    />
  </Switch>
);

export default Routes;
