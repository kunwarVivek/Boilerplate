import { useState } from 'react';
import { ChevronRight, GripVertical, Users } from 'lucide-react';
import { Team } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface TeamHierarchyNodeProps {
  team: Team;
  level: number;
  isDragging: boolean;
  isOver: boolean;
  onDragStart: (team: Team) => void;
  onDragEnd: () => void;
  onDrop: (teamId: string, newParentId: string | null) => Promise<void>;
}

export function TeamHierarchyNode({
  team,
  level,
  isDragging,
  isOver,
  onDragStart,
  onDragEnd,
  onDrop,
}: TeamHierarchyNodeProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div
      className={cn(
        'relative transition-all duration-200',
        isDragging && 'opacity-50',
        isOver && 'before:absolute before:inset-0 before:border-2 before:border-primary before:rounded-lg before:border-dashed'
      )}
      style={{ paddingLeft: `${level * 1.5}rem` }}
    >
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('text/plain', team.id);
          onDragStart(team);
        }}
        onDragEnd={onDragEnd}
        onDragOver={(e) => e.preventDefault()}
        onDrop={async (e) => {
          e.preventDefault();
          const draggedTeamId = e.dataTransfer.getData('text/plain');
          if (draggedTeamId !== team.id) {
            await onDrop(draggedTeamId, team.id);
          }
        }}
        className={cn(
          'group flex items-center gap-2 p-2 rounded-lg hover:bg-muted/50 cursor-grab active:cursor-grabbing',
          isOver && 'bg-muted/50'
        )}
      >
        <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 justify-start gap-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ChevronRight
            className={cn(
              'h-4 w-4 transition-transform',
              isExpanded && 'rotate-90'
            )}
          />
          <span>{team.name}</span>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="ml-2">
                <Users className="h-3 w-3 mr-1" />
                {team.memberCount || 0}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              {team.memberCount || 0} team members
            </TooltipContent>
          </Tooltip>
        </Button>
      </div>

      {isExpanded && team.children?.length > 0 && (
        <div className="mt-1 space-y-1 animate-in slide-in-from-left-1">
          {team.children.map((child) => (
            <TeamHierarchyNode
              key={child.id}
              team={child}
              level={level + 1}
              isDragging={isDragging}
              isOver={isOver}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDrop={onDrop}
            />
          ))}
        </div>
      )}
    </div>
  );
}