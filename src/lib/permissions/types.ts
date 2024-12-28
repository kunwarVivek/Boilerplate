// Define core permission types
export type Resource = 'team' | 'user' | 'organization' | 'role';
export type Action = 'create' | 'read' | 'update' | 'delete' | 'manage';

export type Permission = `${Resource}:${Action}`;

export interface Role {
  id: string;
  name: string;
  organizationId: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

// Predefined roles with their permissions
export const ROLE_PRESETS = {
  OWNER: [
    'organization:manage',
    'team:manage',
    'user:manage',
    'role:manage',
  ] as Permission[],
  ADMIN: [
    'team:manage',
    'user:manage',
    'role:read',
  ] as Permission[],
  MEMBER: [
    'team:read',
    'user:read',
  ] as Permission[],
} as const;