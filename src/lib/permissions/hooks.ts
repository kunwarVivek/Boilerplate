import { useEffect, useState } from 'react';
import { Permission } from './types';
import { getRolePermissions } from './roles';
import { useAuth } from '@/components/auth/AuthProvider';

export function usePermissions() {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPermissions() {
      if (!user?.role) {
        setPermissions([]);
        setLoading(false);
        return;
      }

      try {
        const perms = await getRolePermissions(user.role);
        setPermissions(perms);
      } catch (error) {
        console.error('Failed to load permissions:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPermissions();
  }, [user?.role]);

  function hasPermission(permission: Permission): boolean {
    return permissions.includes(permission);
  }

  return {
    permissions,
    hasPermission,
    loading,
  };
}