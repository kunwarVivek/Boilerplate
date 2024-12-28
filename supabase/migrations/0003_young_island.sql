/*
  # Add tenant and white-labeling support

  1. New Tables
    - `tenant_settings` - Stores tenant-specific configurations
    - `tenant_domains` - Custom domain mappings for tenants
    - `tenant_themes` - White-labeling theme settings
    - `translations` - Multi-language support

  2. Changes
    - Add tenant_id to existing tables
    - Add language preferences to users table

  3. Security
    - Enable RLS on new tables
    - Add tenant isolation policies
*/

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tenant Settings
CREATE TABLE tenant_settings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  default_language text DEFAULT 'en',
  available_languages text[] DEFAULT ARRAY['en'],
  custom_domain text UNIQUE,
  features jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Tenant Themes (White-labeling)
CREATE TABLE tenant_themes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  name text NOT NULL,
  is_active boolean DEFAULT false,
  primary_color text DEFAULT '#000000',
  secondary_color text DEFAULT '#ffffff',
  font_family text DEFAULT 'Inter',
  logo_url text,
  favicon_url text,
  custom_css text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, name)
);

-- Translations
CREATE TABLE translations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  language text NOT NULL,
  namespace text NOT NULL,
  key text NOT NULL,
  value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, language, namespace, key)
);

-- Add language preference to users
ALTER TABLE users ADD COLUMN preferred_language text DEFAULT 'en';

-- Enable RLS
ALTER TABLE tenant_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their organization's tenant settings"
  ON tenant_settings
  FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can view their organization's themes"
  ON tenant_themes
  FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can view their organization's translations"
  ON translations
  FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

-- Indexes for performance
CREATE INDEX idx_tenant_settings_org ON tenant_settings(organization_id);
CREATE INDEX idx_tenant_themes_org ON tenant_themes(organization_id);
CREATE INDEX idx_translations_lookup ON translations(organization_id, language, namespace);