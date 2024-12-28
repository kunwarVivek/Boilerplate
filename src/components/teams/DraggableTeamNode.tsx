import { useState } from 'react';
import { Team } from '@/types';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DraggableTeamNodeProps {
  team: Team;
  level: number;
  onDrop: (teamId: string, newParentId: string | null) => Promise<void>;
}

export function DraggableTeamNode({ team, level, onDrop }: DraggableTeamNodeProps) {
  const [isOver, setIsOver] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', team.id);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={async (e) => {
        e.preventDefault();
        setIsOver(false);
        const draggedTeamId = e.dataTransfer.getData('text/plain');
        if (draggedTeamId !== team.id) {
          await onDrop(draggedTeamId, team.id);
        }
      }}
      className={cn(
        'transition-colors',
        isOver && 'bg-muted/50 rounded-lg'
      )}
      style={{ marginLeft: `${level * 1.5}rem` }}
    >
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="ml-2">{team.name}</span>
      </Button>
    </div>
  );
}