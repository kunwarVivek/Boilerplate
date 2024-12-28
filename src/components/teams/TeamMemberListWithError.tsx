import { TeamMemberList } from './TeamMemberList';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface TeamMemberListWithErrorProps {
  teamId: string;
}

export function TeamMemberListWithError({ teamId }: TeamMemberListWithErrorProps) {
  return (
    <ErrorBoundary>
      <TeamMemberList teamId={teamId} />
    </ErrorBoundary>
  );
}