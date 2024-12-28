import { AuditLogList } from './AuditLogList';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface AuditLogListWithErrorProps {
  organizationId: string;
  limit?: number;
  offset?: number;
  filters?: {
    action?: string;
    targetType?: string;
    search?: string;
  };
  onTotalItemsChange?: (total: number) => void;
}

export function AuditLogListWithError(props: AuditLogListWithErrorProps) {
  return (
    <ErrorBoundary>
      <AuditLogList {...props} />
    </ErrorBoundary>
  );
}