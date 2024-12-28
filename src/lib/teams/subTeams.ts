```typescript
import { supabase } from '../supabase';
import { Team } from '@/types';

export async function createSubTeam(data: {
  name: string;
  parentTeamId: string;
  organizationId: string;
}) {
  const { data: team, error } = await supabase
    .from('teams')
    .insert({
      name: data.name,
      parent_team_id: data.parentTeamId,
      organization_id: data.organizationId
    })
    .select()
    .single();

  if (error) throw error;
  return team;
}

export async function getTeamHierarchy(organizationId: string): Promise<Team[]> {
  const { data, error } = await supabase
    .from('teams')
    .select(`
      *,
      parent:parent_team_id(id, name),
      children:teams!parent_team_id(*)
    `)
    .eq('organization_id', organizationId);

  if (error) throw error;
  return data;
}

export async function updateTeamParent(teamId: string, newParentId: string | null) {
  const { error } = await supabase
    .from('teams')
    .update({ parent_team_id: newParentId })
    .eq('id', teamId);

  if (error) throw error;
}
```