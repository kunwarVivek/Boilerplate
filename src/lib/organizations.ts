import { Organization } from '@/types';
import { supabase } from './supabase';

export async function createOrganization(data: {
  name: string;
  slug: string;
}): Promise<Organization> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { data: org, error } = await supabase
    .from('organizations')
    .insert({
      name: data.name,
      slug: data.slug,
      owner_id: userData.user.id,
    })
    .select()
    .single();

  if (error) throw error;
  return org;
}

export async function getOrganization(id: string): Promise<Organization> {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateOrganization(
  id: string,
  data: Partial<Organization>
): Promise<Organization> {
  const { data: org, error } = await supabase
    .from('organizations')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return org;
}