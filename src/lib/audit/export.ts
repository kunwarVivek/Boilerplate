import { supabase } from '../supabase';
import { AuditLogEntry } from './types';

export async function exportAuditLogs(
  organizationId: string,
  startDate: Date,
  endDate: Date,
  format: 'csv' | 'json' = 'csv'
): Promise<string> {
  const { data, error } = await supabase
    .from('audit_logs')
    .select(`
      *,
      actor:users!actor_id(full_name, email)
    `)
    .eq('organization_id', organizationId)
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .order('created_at', { ascending: false });

  if (error) throw error;

  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }

  // Convert to CSV
  const headers = [
    'Date',
    'Action',
    'Actor',
    'Target Type',
    'Target ID',
    'Details'
  ];

  const rows = data.map((log: AuditLogEntry) => [
    new Date(log.createdAt).toLocaleString(),
    log.action,
    log.actor.email,
    log.targetType,
    log.targetId,
    JSON.stringify(log.metadata)
  ]);

  return [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
}