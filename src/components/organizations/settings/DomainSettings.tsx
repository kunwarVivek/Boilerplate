import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { updateOrganizationSettings } from '@/lib/organizations/settings';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const domainSettingsSchema = z.object({
  requireEmailDomain: z.boolean(),
  allowedEmailDomains: z.array(z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/)),
});

type DomainSettingsFormData = z.infer<typeof domainSettingsSchema>;

interface DomainSettingsProps {
  organizationId: string;
  settings: DomainSettingsFormData;
}

export function DomainSettings({ organizationId, settings }: DomainSettingsProps) {
  const [loading, setLoading] = useState(false);
  const [newDomain, setNewDomain] = useState('');

  const form = useForm<DomainSettingsFormData>({
    resolver: zodResolver(domainSettingsSchema),
    defaultValues: settings,
  });

  async function onSubmit(data: DomainSettingsFormData) {
    try {
      setLoading(true);
      await updateOrganizationSettings(organizationId, data);
      toast.success('Domain settings updated');
    } catch (error) {
      toast.error('Failed to update domain settings');
    } finally {
      setLoading(false);
    }
  }

  function addDomain() {
    const domains = form.getValues('allowedEmailDomains');
    if (newDomain && !domains.includes(newDomain)) {
      form.setValue('allowedEmailDomains', [...domains, newDomain]);
      setNewDomain('');
    }
  }

  function removeDomain(domain: string) {
    const domains = form.getValues('allowedEmailDomains');
    form.setValue(
      'allowedEmailDomains',
      domains.filter((d) => d !== domain)
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Domain Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="requireEmailDomain"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>Restrict Email Domains</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Only allow users with specific email domains
                    </div>
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
            
            <div className="space-y-4">
              <FormLabel>Allowed Email Domains</FormLabel>
              <div className="flex gap-2">
                <Input
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="example.com"
                />
                <Button type="button" onClick={addDomain}>
                  Add
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {form.watch('allowedEmailDomains').map((domain) => (
                  <Badge key={domain} variant="secondary">
                    {domain}
                    <button
                      type="button"
                      onClick={() => removeDomain(domain)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
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