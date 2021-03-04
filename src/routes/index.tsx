import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';

import Profile from '../pages/Profile';
import Dashboard from '../pages/Dashboard';
import Ocorrencias from '../pages/Ocorrencias';
import OcorrenciaDetalhes from '../pages/OcorrenciaDetalhes';

import Negociacoes from '../pages/Negociacoes';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={SignIn} />
    <Route path="/signup" exact component={SignUp} />

    <Route path="/profile" exact component={Profile} isPrivate />
    <Route path="/dashboard" exact component={Dashboard} isPrivate />
    <Route
      path="/ocorrencias/:ocorrenciaId/detalhes"
      exact
      component={OcorrenciaDetalhes}
      isPrivate
    />
    <Route path="/ocorrencias" exact component={Ocorrencias} isPrivate />
    <Route path="/negociacoes" exact component={Negociacoes} isPrivate />
  </Switch>
);

export default Routes;
