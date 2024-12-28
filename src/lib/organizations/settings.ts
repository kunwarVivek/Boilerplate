import { supabase } from '../supabase';

export interface OrganizationSettings {
  allowUserInvites: boolean;
  requireEmailDomain: boolean;
  allowedEmailDomains: string[];
  defaultUserRole: string;
  securitySettings: {
    mfaRequired: boolean;
    passwordMinLength: number;
    sessionTimeout: number;
  };
}

export async function getOrganizationSettings(organizationId: string) {
  const { data, error } = await supabase
    .from('organization_settings')
    .select('*')
    .eq('organization_id', organizationId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateOrganizationSettings(
  organizationId: string,
  settings: Partial<OrganizationSettings>
) {
  const { data, error } = await supabase
    .from('organization_settings')
    .update(settings)
    .eq('organization_id', organizationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}