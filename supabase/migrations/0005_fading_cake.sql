/*
  # Add Billing and MFA Support

  1. New Tables
    - user_mfa: Stores MFA configuration for users
    - subscription_tiers: Defines available subscription plans
    - organization_subscriptions: Tracks organization subscriptions
    - usage_records: Records feature usage
    - invoices: Stores billing invoices

  2. Security
    - Enable RLS on all new tables
    - Add policies for secure access
    - Create indexes for performance

  3. Changes
    - Add MFA support for users
    - Add subscription management
    - Add usage tracking
    - Add invoice management
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- MFA Configuration
CREATE TABLE IF NOT EXISTS user_mfa (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  secret text NOT NULL,
  enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Billing and Subscriptions
CREATE TABLE IF NOT EXISTS subscription_tiers (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  features jsonb DEFAULT '{}',
  limits jsonb DEFAULT '{}',
  stripe_price_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS organization_subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  tier_id uuid REFERENCES subscription_tiers(id) NOT NULL,
  stripe_subscription_id text,
  status text DEFAULT 'active',
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS usage_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid REFERENCES organizations(id) NOT NULL,
  feature text NOT NULL,
  quantity integer NOT NULL,
  recorded_at timestamptz DEFAULT now()
);

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

-- Enable RLS
ALTER TABLE user_mfa ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own MFA"
  ON user_mfa
  FOR ALL
  USING (user_id = auth.uid());

CREATE POLICY "Users can view subscription tiers"
  ON subscription_tiers
  FOR SELECT
  USING (true);

CREATE POLICY "Users can view their organization's subscription"
  ON organization_subscriptions
  FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can view their organization's usage"
  ON usage_records
  FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

CREATE POLICY "Users can view their organization's invoices"
  ON invoices
  FOR SELECT
  USING (organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  ));

-- Indexes
CREATE INDEX idx_user_mfa_user ON user_mfa(user_id);
CREATE INDEX idx_subscriptions_org ON organization_subscriptions(organization_id);
CREATE INDEX idx_usage_records_org_feature ON usage_records(organization_id, feature);
CREATE INDEX idx_invoices_org ON invoices(organization_id);