export type AuditAction = 
  | 'settings.update'
  | 'team.create'
  | 'team.update'
  | 'team.delete'
  | 'member.invite'
  | 'member.remove'
  | 'role.create'
  | 'role.update'
  | 'role.delete';

export interface AuditLogEntry {
  id: string;
  organizationId: string;
  action: AuditAction;
  actorId: string;
  targetType: string;
  targetId: string;
  metadata: Record<string, any>;
  createdAt: string;
}