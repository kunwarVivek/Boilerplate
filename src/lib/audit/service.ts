import { supabase } from '../supabase';
import { AuditAction, AuditLogEntry } from './types';

export async function createAuditLog(data: {
  organizationId: string;
  action: AuditAction;
  targetType: string;
  targetId: string;
  metadata?: Record<string, any>;
}): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) throw new Error('Not authenticated');

  const { error } = await supabase.from('audit_logs').insert({
    organization_id: data.organizationId,
    action: data.action,
    actor_id: userData.user.id,
    target_type: data.targetType,
    target_id: data.targetId,
    metadata: data.metadata || {},
  });

  if (error) throw error;
}

export async function getAuditLogs(
  organizationId: string,
  options?: {
    limit?: number;
    offset?: number;
    action?: AuditAction;
    targetType?: string;
  }
): Promise<AuditLogEntry[]> {
  let query = supabase
    .from('audit_logs')
    .select(`
      *,
      actor:users!actor_id(full_name, email)
    `)
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (options?.action) {
    query = query.eq('action', options.action);
  }

  if (options?.targetType) {
    query = query.eq('target_type', options.targetType);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}