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
      const userRoles = user.roles.map(role => {
        return role.name;
      });
      const isSame =
        Array.isArray(roles) &&
        Array.isArray(userRoles) &&
        roles.length === userRoles.length &&
        roles.every((val, index) => val === userRoles[index]);
      setHasPermissions(isSame);
    } else {
      const findRole = user.roles.some(role => {
        return roles.includes(role.name);
      });
      setHasPermissions(findRole);
    }
  }, [roles, isExactlyRoles, user.roles]);

  return <>{hasPermission && children}</>;
};

export default PermissionComponent;
