import React, { useState } from 'react';
import { useEffect } from 'react';

import { useAuth } from '../../hooks/auth';

interface PermissionComponentProps {
  roles: string[];
  isExactlyRoles?: boolean;
}

const PermissionComponent: React.FC<PermissionComponentProps> = ({
  roles,
  isExactlyRoles,
  children,
}) => {
  const [hasPermission, setHasPermissions] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (isExactlyRoles) {
      const isSame =
        roles.length === user.roles.length &&
        roles.every((element, index) => {
          return element === user.roles[index];
        });
      setHasPermissions(isSame);
    } else {
      const findRole = user.roles.some(role => {
        return roles.includes(role.toString());
      });
      setHasPermissions(findRole);
    }
  }, [roles, isExactlyRoles, user.roles]);

  return <>{hasPermission && children}</>;
};

export default PermissionComponent;
