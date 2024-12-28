import { InviteMemberDialog } from './InviteMemberDialog';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface InviteMemberDialogWithErrorProps {
  teamId: string;
  organizationId: string;
  onInviteSent: () => void;
}

export function InviteMemberDialogWithError(props: InviteMemberDialogWithErrorProps) {
  return (
    <ErrorBoundary>
      <InviteMemberDialog {...props} />
    </ErrorBoundary>
  );
}