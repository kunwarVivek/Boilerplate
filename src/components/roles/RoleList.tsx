import { useState, useEffect } from 'react';
import { Role } from '@/lib/permissions/types';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export function RoleList({ organizationId }: { organizationId: string }) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoles() {
      try {
        const { data, error } = await supabase
          .from('roles')
          .select(`
            *,
            role_permissions (
              permission
            )
          `)
          .eq('organization_id', organizationId);

        if (error) throw error;

        const rolesWithPermissions = data.map(role => ({
          ...role,
          permissions: role.role_permissions.map(rp => rp.permission),
        }));

        setRoles(rolesWithPermissions);
      } catch (error) {
        console.error('Failed to load roles:', error);
      } finally {
        setLoading(false);
      }
    }

    loadRoles();
  }, [organizationId]);

  if (loading) {
    return <div>Loading roles...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {roles.map((role) => (
        <Card key={role.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {role.name}
            </CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Permissions:
              </p>
              <div className="flex flex-wrap gap-1">
                {role.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}