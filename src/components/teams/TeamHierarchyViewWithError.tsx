import { TeamHierarchyView } from './TeamHierarchyView';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface TeamHierarchyViewWithErrorProps {
  organizationId: string;
}

export function TeamHierarchyViewWithError({ organizationId }: TeamHierarchyViewWithErrorProps) {
  return (
    <ErrorBoundary>
      <TeamHierarchyView organizationId={organizationId} />
    </ErrorBoundary>
  );
}