import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from '@/components/ui/form';
import { NotificationSettings, NotificationEvent } from '@/lib/organizations/settings/types';

const NOTIFICATION_EVENTS: { value: NotificationEvent; label: string }[] = [
  { value: 'team.created', label: 'Team Created' },
  { value: 'team.updated', label: 'Team Updated' },
  { value: 'team.deleted', label: 'Team Deleted' },
  { value: 'member.invited', label: 'Member Invited' },
  { value: 'member.joined', label: 'Member Joined' },
  { value: 'member.left', label: 'Member Left' },
  { value: 'security.alert', label: 'Security Alert' },
  { value: 'billing.invoice', label: 'Billing Invoice' },
  { value: 'billing.payment_failed', label: 'Payment Failed' },
];

export function NotificationChannelForm() {
  const { control } = useFormContext<NotificationSettings>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'channels',
  });

  return (
    <div className="space-y-6">
      {fields.map((field, index) => (
        <div key={field.id} className="p-4 border rounded-lg space-y-4">
          <div className="flex justify-between items-center">
            <FormField
              control={control}
              name={`channels.${index}.type`}
              render={({ field }) => (
                <FormItem className="w-[200px]">
                  <FormLabel>Channel Type</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="slack">Slack</SelectItem>
                      <SelectItem value="teams">Microsoft Teams</SelectItem>
                      <SelectItem value="webhook">Custom Webhook</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => remove(index)}
            >
              Remove
            </Button>
          </div>

          <FormField
            control={control}
            name={`channels.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Channel Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`channels.${index}.url`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Webhook URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription>
                  {field.value.includes('hooks.teams.microsoft.com')
                    ? 'Microsoft Teams incoming webhook URL'
                    : field.value.includes('hooks.slack.com')
                    ? 'Slack incoming webhook URL'
                    : 'Custom webhook URL'}
                </FormDescription>
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Notification Events</FormLabel>
            <div className="grid grid-cols-2 gap-2">
              {NOTIFICATION_EVENTS.map(event => (
                <FormField
                  key={event.value}
                  control={control}
                  name={`channels.${index}.events`}
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(event.value)}
                          onCheckedChange={(checked) => {
                            const newEvents = checked
                              ? [...field.value, event.value]
                              : field.value.filter((e: string) => e !== event.value);
                            field.onChange(newEvents);
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        {event.label}
                      </FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => append({
          type: 'webhook',
          name: '',
          url: '',
          enabled: true,
          events: [],
        })}
      >
        Add Notification Channel
      </Button>
    </div>
  );
}