import { Role, Permission } from './types';
import { supabase } from '../supabase';

export async function createRole(data: {
  name: string;
  organizationId: string;
  permissions: Permission[];
}): Promise<Role> {
  const { data: role, error } = await supabase
    .from('roles')
    .insert({
      name: data.name,
      organization_id: data.organizationId,
    })
    .select()
    .single();

  if (error) throw error;

  // Insert permissions
  const { error: permError } = await supabase
    .from('role_permissions')
    .insert(
      data.permissions.map(permission => ({
        role_id: role.id,
        permission,
      }))
    );

  if (permError) throw permError;

  return {
    ...role,
    permissions: data.permissions,
  };
}

export async function getRolePermissions(roleId: string): Promise<Permission[]> {
  const { data, error } = await supabase
    .from('role_permissions')
    .select('permission')
    .eq('role_id', roleId);

  if (error) throw error;
  return data.map(p => p.permission);
}

export async function updateRolePermissions(
  roleId: string,
  permissions: Permission[]
): Promise<void> {
  // Delete existing permissions
  const { error: deleteError } = await supabase
    .from('role_permissions')
    .delete()
    .eq('role_id', roleId);

  if (deleteError) throw deleteError;

  // Insert new permissions
  const { error } = await supabase
    .from('role_permissions')
    .insert(
      permissions.map(permission => ({
        role_id: roleId,
        permission,
      }))
    );

  if (error) throw error;
}