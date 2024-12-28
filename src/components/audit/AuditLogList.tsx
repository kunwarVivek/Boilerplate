import { useEffect } from 'react';
import { getAuditLogs } from '@/lib/audit/service';
import { AuditLogEntry } from '@/lib/audit/types';
import { useAsyncState } from '@/hooks/useAsyncState';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorAlert } from '@/components/ui/error-alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';

interface AuditLogListProps {
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

export function AuditLogList({ 
  organizationId, 
  limit = 10,
  offset = 0,
  filters,
  onTotalItemsChange 
}: AuditLogListProps) {
  const { data: logs, loading, error, setLoading, setData, setError } = 
    useAsyncState<AuditLogEntry[]>([]);

  async function loadLogs() {
    try {
      setLoading();
      const data = await getAuditLogs(organizationId, {
        limit,
        offset,
        ...filters
      });
      setData(data);
      onTotalItemsChange?.(data.length);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load audit logs'));
    }
  }

  useEffect(() => {
    loadLogs();
  }, [organizationId, limit, offset, filters]);

  if (loading) {
    return <LoadingState message="Loading audit logs..." />;
  }

  if (error) {
    return <ErrorAlert error={error} onRetry={loadLogs} />;
  }

  if (!logs?.length) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No audit logs found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Action</TableHead>
          <TableHead>User</TableHead>
          <TableHead>Target</TableHead>
          <TableHead>Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell className="font-medium">{log.action}</TableCell>
            <TableCell>{log.actor.email}</TableCell>
            <TableCell>{`${log.targetType}:${log.targetId}`}</TableCell>
            <TableCell>
              {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}