import { useState, useEffect } from 'react';
import { ChevronRight, FolderTree } from 'lucide-react';
import { Team } from '@/types';
import { getTeams } from '@/lib/teams';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface TeamNode extends Team {
  children: TeamNode[];
}

interface TeamHierarchyViewProps {
  organizationId: string;
}

export function TeamHierarchyView({ organizationId }: TeamHierarchyViewProps) {
  const [teams, setTeams] = useState<TeamNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeams() {
      try {
        const allTeams = await getTeams(organizationId);
        const hierarchy = buildTeamHierarchy(allTeams);
        setTeams(hierarchy);
      } catch (error) {
        console.error('Failed to load teams:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTeams();
  }, [organizationId]);

  if (loading) {
    return <div>Loading team hierarchy...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <FolderTree className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Team Hierarchy</h2>
      </div>
      
      <div className="space-y-2">
        {teams.map((team) => (
          <TeamNode key={team.id} team={team} level={0} />
        ))}
      </div>
    </div>
  );
}

function TeamNode({ team, level }: { team: TeamNode; level: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = team.children.length > 0;

  return (
    <div style={{ marginLeft: `${level * 1.5}rem` }}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
          >
            <ChevronRight
              className={`h-4 w-4 transition-transform ${
                isOpen ? 'rotate-90' : ''
              }`}
            />
            <span className="ml-2">{team.name}</span>
            {team.description && (
              <span className="ml-2 text-sm text-muted-foreground">
                ({team.description})
              </span>
            )}
          </Button>
        </CollapsibleTrigger>
        
        {hasChildren && (
          <CollapsibleContent>
            <div className="pt-1">
              {team.children.map((child) => (
                <TeamNode
                  key={child.id}
                  team={child}
                  level={level + 1}
                />
              ))}
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
}

function buildTeamHierarchy(teams: Team[]): TeamNode[] {
  const teamMap = new Map<string, TeamNode>();
  const rootTeams: TeamNode[] = [];

  // First pass: Create nodes
  teams.forEach((team) => {
    teamMap.set(team.id, { ...team, children: [] });
  });

  // Second pass: Build hierarchy
  teams.forEach((team) => {
    const node = teamMap.get(team.id)!;
    if (team.parent_team_id) {
      const parent = teamMap.get(team.parent_team_id);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      rootTeams.push(node);
    }
  });

  return rootTeams;
}