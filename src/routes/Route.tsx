import React from 'react';
import {
  Route as ReactDOMRoute,
  RouteProps as ReactDOMRouteProps,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../hooks/auth';
import { useCan } from '../hooks/useCan';

interface RouteProps extends ReactDOMRouteProps {
  isPrivate?: boolean;
  permissions?: string[];
  roles?: string[];
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivate = false,
  permissions,
  roles,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();
  const useCanSeeComponent = useCan({ permissions, roles });

  if (user) {
    if (!useCanSeeComponent) {
      return (
        <Redirect
          to={{
            pathname: isPrivate ? '/' : '/dashboard',
          }}
        />
      );
    }
  }

  return (
    <ReactDOMRoute
      {...rest}
      render={({ location }) => {
        return isPrivate === !!user ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivate ? '/' : '/dashboard',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default Route;
