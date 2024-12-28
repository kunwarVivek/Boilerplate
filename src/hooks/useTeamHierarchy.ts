import { useState, useCallback } from 'react';
import { Team } from '@/types';
import { getTeams, updateTeam } from '@/lib/teams';
import { useAsyncAction } from './useAsyncAction';

export function useTeamHierarchy(organizationId: string) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { execute } = useAsyncAction({
    successMessage: 'Team hierarchy updated',
  });

  const loadTeams = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getTeams(organizationId);
      setTeams(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load teams'));
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  const moveTeam = useCallback(async (teamId: string, newParentId: string | null) => {
    await execute(async () => {
      await updateTeam(teamId, { parent_team_id: newParentId });
      await loadTeams();
    });
  }, [execute, loadTeams]);

  return {
    teams,
    loading,
    error,
    loadTeams,
    moveTeam,
  };
}