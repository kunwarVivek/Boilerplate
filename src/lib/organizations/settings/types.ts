import { z } from 'zod';

export const notificationEventSchema = z.enum([
  'team.created',
  'team.updated',
  'team.deleted',
  'member.invited',
  'member.joined',
  'member.left',
  'security.alert',
  'billing.invoice',
  'billing.payment_failed'
]);

export const notificationChannelSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['slack', 'teams', 'webhook']),
  name: z.string().min(1, 'Name is required'),
  url: z.string().url('Invalid webhook URL'),
  enabled: z.boolean(),
  events: z.array(notificationEventSchema),
});

export const notificationSettingsSchema = z.object({
  emailNotifications: z.object({
    security: z.boolean(),
    billing: z.boolean(),
    teamUpdates: z.boolean(),
  }),
  channels: z.array(notificationChannelSchema),
});

export type NotificationEvent = z.infer<typeof notificationEventSchema>;
export type NotificationChannel = z.infer<typeof notificationChannelSchema>;
export type NotificationSettings = z.infer<typeof notificationSettingsSchema>;