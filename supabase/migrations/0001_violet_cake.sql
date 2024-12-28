/*
  # Initial Schema Setup for B2B SaaS Platform

  1. Core Tables
    - users (extends auth.users)
    - organizations
    - teams
    - team_members
    - roles
    - role_permissions
    - audit_logs

  2. Security
    - RLS policies for all tables
    - Organization-based isolation
    - Role-based access control

  3. Indexes
    - Optimized queries for common operations
    - Foreign key relationships
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Organizations table
CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug citext UNIQUE NOT NULL,
  logo_url text,
  subscription_tier text DEFAULT 'free',
  subscription_status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  owner_id uuid REFERENCES auth.users(id)
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Users table (extends auth.users)
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email citext NOT NULL,
  full_name text,
  avatar_url text,
  organization_id uuid REFERENCES organizations(id),
  role text DEFAULT 'member',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Teams table
CREATE TABLE teams (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  parent_team_id uuid REFERENCES teams(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Team members table
CREATE TABLE team_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id uuid REFERENCES teams(id) NOT NULL,
  user_id uuid REFERENCES users(id) NOT NULL,
  role text DEFAULT 'member',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(team_id, user_id)
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Roles table
CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(name, organization_id)
);

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Role permissions table
CREATE TABLE role_permissions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id uuid REFERENCES roles(id) NOT NULL,
  permission text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(role_id, permission)
);

ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Audit logs table
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  action text NOT NULL,
  actor_id uuid REFERENCES users(id) NOT NULL,
  target_type text NOT NULL,
  target_id uuid NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Organizations
CREATE POLICY "Users can view their own organization"
  ON organizations
  FOR SELECT
  USING (id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

-- Users
CREATE POLICY "Users can view members in their organization"
  ON users
  FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  USING (id = auth.uid());

-- Teams
CREATE POLICY "Users can view teams in their organization"
  ON teams
  FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

-- Team Members
CREATE POLICY "Users can view team members in their organization"
  ON team_members
  FOR SELECT
  USING (team_id IN (
    SELECT id FROM teams WHERE organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  ));

-- Roles
CREATE POLICY "Users can view roles in their organization"
  ON roles
  FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

-- Role Permissions
CREATE POLICY "Users can view role permissions in their organization"
  ON role_permissions
  FOR SELECT
  USING (role_id IN (
    SELECT id FROM roles WHERE organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    )
  ));

-- Audit Logs
CREATE POLICY "Users can view audit logs in their organization"
  ON audit_logs
  FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));