import { supabase } from '@/lib/supabase';
import { OrganizationSettings } from './types';

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