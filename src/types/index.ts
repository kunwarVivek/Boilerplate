export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  organization_id?: string;
  role?: string;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  created_at: string;
  updated_at: string;
  owner_id: string;
  subscription_tier?: string;
  subscription_status?: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  organization_id: string;
  parent_team_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  name: string;
  organization_id: string;
  permissions: string[];
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actor_id: string;
  target_type: string;
  target_id: string;
  metadata: Record<string, any>;
  created_at: string;
  organization_id: string;
}