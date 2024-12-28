import { Team } from '@/types';
import { supabase } from './supabase';

export async function createTeam(data: {
  name: string;
  description?: string;
  organizationId: string;
  parentTeamId?: string;
}): Promise<Team> {
  const { data: team, error } = await supabase
    .from('teams')
    .insert({
      name: data.name,
      description: data.description,
      organization_id: data.organizationId,
      parent_team_id: data.parentTeamId,
    })
    .select()
    .single();

  if (error) throw error;
  return team;
}

export async function getTeams(organizationId: string): Promise<Team[]> {
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('organization_id', organizationId)
    .order('name');

  if (error) throw error;
  return data;
}

export async function updateTeam(
  id: string,
  data: Partial<Team>
): Promise<Team> {
  const { data: team, error } = await supabase
    .from('teams')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return team;
}

export async function deleteTeam(id: string): Promise<void> {
  const { error } = await supabase
    .from('teams')
    .delete()
    .eq('id', id);

  if (error) throw error;
}