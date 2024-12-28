import { useState } from 'react';
import { Team } from '@/types';
import { TeamHierarchyNode } from './TeamHierarchyNode';
import { updateTeam } from '@/lib/teams';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { ErrorState } from '@/components/ui/error-state';
import { LoadingState } from '@/components/ui/loading-state';
import { FolderTree } from 'lucide-react';

interface EnhancedTeamHierarchyProps {
  teams: Team[];
  onTeamMoved: () => void;
}

export function EnhancedTeamHierarchy({ teams, onTeamMoved }: EnhancedTeamHierarchyProps) {
  const [error, setError] = useState<Error | null>(null);
  const [draggedTeam, setDraggedTeam] = useState<Team | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);

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

  function buildHierarchy(parentId: string | null = null): Team[] {
    return teams
      .filter(team => team.parent_team_id === parentId)
      .map(team => ({
        ...team,
        children: buildHierarchy(team.id),
      }));
  }

  const hierarchy = buildHierarchy(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <FolderTree className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Team Hierarchy</h2>
      </div>

      <div className="space-y-1 rounded-lg border bg-card p-4">
        {hierarchy.map(team => (
          <TeamHierarchyNode
            key={team.id}
            team={team}
            level={0}
            isDragging={draggedTeam?.id === team.id}
            isOver={dropTarget === team.id}
            onDragStart={setDraggedTeam}
            onDragEnd={() => {
              setDraggedTeam(null);
              setDropTarget(null);
            }}
            onDrop={handleTeamDrop}
          />
        ))}

        {hierarchy.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No teams found. Create a team to get started.
          </div>
        )}
      </div>
    </div>
  );
}