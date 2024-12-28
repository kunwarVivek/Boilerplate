import { useState } from 'react';
import { Team } from '@/types';
import { DraggableTeamNode } from './DraggableTeamNode';
import { updateTeam } from '@/lib/teams';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';

interface DraggableTeamHierarchyProps {
  teams: Team[];
  onTeamMoved: () => void;
}

export function DraggableTeamHierarchy({ teams, onTeamMoved }: DraggableTeamHierarchyProps) {
  const [error, setError] = useState<Error | null>(null);
  const { loading, execute } = useAsyncAction({
    successMessage: 'Team hierarchy updated',
    onSuccess: onTeamMoved,
  });

  async function handleTeamDrop(teamId: string, newParentId: string | null) {
    try {
      await execute(async () => {
        await updateTeam(teamId, { parent_team_id: newParentId });
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update team hierarchy'));
    }
  }

  if (loading) {
    return <LoadingState message="Updating team hierarchy..." />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  function buildHierarchy(parentId: string | null = null, level: number = 0): Team[] {
    return teams
      .filter(team => team.parent_team_id === parentId)
      .map(team => ({
        ...team,
        children: buildHierarchy(team.id, level + 1),
      }));
  }

  const hierarchy = buildHierarchy();

  return (
    <div className="space-y-2">
      {hierarchy.map(team => (
        <DraggableTeamNode
          key={team.id}
          team={team}
          level={0}
          onDrop={handleTeamDrop}
        />
      ))}
    </div>
  );
}