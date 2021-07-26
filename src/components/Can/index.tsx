import React, { ReactNode } from 'react';
import { useCan } from '../../hooks/useCan';

interface CanProps {
  children: ReactNode;
  permissions?: string[];
  roles?: string[];
}

const Can: React.FC<CanProps> = ({ children, permissions, roles }) => {
  const useCanSeeComponent = useCan({ permissions, roles });

  if (!useCanSeeComponent) {
    return null;
  }

  return <>{children}</>;
};

export default Can;
