import { useAuth } from './auth';

type UseCanParams = {
  permissions?: string[];
  roles?: string[];
};

export function useCan({ permissions, roles }: UseCanParams): boolean {
  const { user } = useAuth();

  if (!user) {
    return false;
  }

  if (permissions && permissions?.length > 0) {
    const hasAllPermissions = permissions?.every(permission => {
      return user.permissions.includes(permission);
    });

    if (!hasAllPermissions) {
      return false;
    }
  }

  if (roles && roles?.length > 0) {
    const hasRoles = user.roles?.some(role => {
      return roles.includes(role.name);
    });

    if (!hasRoles) {
      return false;
    }
  }

  return true;
}
