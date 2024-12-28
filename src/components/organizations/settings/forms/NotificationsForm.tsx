import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSettingsForm } from '@/hooks/useSettingsForm';
import { notificationSettingsSchema, NotificationSettingsFormData } from '@/lib/organizations/settings/types';

interface NotificationsFormProps {
  organizationId: string;
  initialData: NotificationSettingsFormData;
  onSubmit: (data: NotificationSettingsFormData) => Promise<void>;
}

export function NotificationsForm({ organizationId, initialData, onSubmit }: NotificationsFormProps) {
  const form = useForm<NotificationSettingsFormData>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: initialData,
  });

  const { loading, handleSubmit } = useSettingsForm({ onSubmit });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Email Notifications</h3>
              
              <FormField
                control={form.control}
                name="emailNotifications.security"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Security Alerts</FormLabel>
                      <FormDescription>
                        Receive notifications about security events and alerts
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="emailNotifications.billing"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Billing Updates</FormLabel>
                      <FormDescription>
                        Receive invoices and billing-related notifications
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="emailNotifications.teamUpdates"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Team Updates</FormLabel>
                      <FormDescription>
                        Get notified about team member changes and activities
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Integrations</h3>
              
              <FormField
                control={form.control}
                name="slackWebhookUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slack Webhook URL</FormLabel>
                    <FormDescription>
                      Receive notifications in your Slack workspace
                    </FormDescription>
                    <FormControl>
                      <Input {...field} placeholder="https://hooks.slack.com/..." />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}