/*
  # Add SSO, Subscription, and Branding Support

  1. New Tables
    - `sso_configurations`: SSO provider settings per organization
    - `subscription_plans`: Available subscription tiers
    - `organization_subscriptions`: Organization subscription details
    - `usage_records`: Feature usage tracking
    - `invoices`: Invoice records

  2. Changes
    - Add SSO fields to users table
    - Add branding fields to organizations table
    - Add subscription-related fields

  3. Security
    - Enable RLS on all new tables
    - Add policies for secure access control
*/

-- Create extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- SSO Configuration
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS sso_configurations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id uuid REFERENCES organizations(id) NOT NULL,
    provider text NOT NULL,
    client_id text NOT NULL,
    client_secret text NOT NULL,
    domain text,
    enabled boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Subscription Plans
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS subscription_plans (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    description text,
    price_monthly numeric NOT NULL,
    price_yearly numeric NOT NULL,
    features jsonb DEFAULT '{}',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Organization Subscriptions
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS organization_subscriptions (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id uuid REFERENCES organizations(id) NOT NULL,
    plan_id uuid REFERENCES subscription_plans(id) NOT NULL,
    stripe_subscription_id text,
    stripe_customer_id text,
    status text DEFAULT 'active',
    current_period_start timestamptz,
    current_period_end timestamptz,
    cancel_at_period_end boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Usage Records
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS usage_records (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id uuid REFERENCES organizations(id) NOT NULL,
    feature text NOT NULL,
    quantity integer NOT NULL,
    recorded_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Invoices
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS invoices (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id uuid REFERENCES organizations(id) NOT NULL,
    stripe_invoice_id text,
    amount numeric NOT NULL,
    status text NOT NULL,
    due_date timestamptz,
    paid_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Add columns to existing tables safely
DO $$ BEGIN
  ALTER TABLE organizations 
    ADD COLUMN IF NOT EXISTS branding jsonb DEFAULT jsonb_build_object(
      'primary_color', '#000000',
      'accent_color', '#ffffff',
      'logo_url', null,
      'favicon_url', null
    );
EXCEPTION
  WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS sso_provider text,
    ADD COLUMN IF NOT EXISTS sso_id text,
    ADD COLUMN IF NOT EXISTS custom_fields jsonb DEFAULT '{}';
EXCEPTION
  WHEN duplicate_column THEN NULL;
END $$;

-- Enable RLS
ALTER TABLE sso_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
DO $$ BEGIN
  CREATE POLICY "Organization admins can manage SSO config"
    ON sso_configurations
    FOR ALL
    USING (organization_id IN (
      SELECT organization_id FROM users
      WHERE id = auth.uid() AND role = 'admin'
    ));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Anyone can view subscription plans"
    ON subscription_plans
    FOR SELECT
    USING (true);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Organization admins can view subscriptions"
    ON organization_subscriptions
    FOR SELECT
    USING (organization_id IN (
      SELECT organization_id FROM users
      WHERE id = auth.uid() AND role = 'admin'
    ));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Organization members can view usage"
    ON usage_records
    FOR SELECT
    USING (organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    ));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Organization members can view invoices"
    ON invoices
    FOR SELECT
    USING (organization_id IN (
      SELECT organization_id FROM users WHERE id = auth.uid()
    ));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;