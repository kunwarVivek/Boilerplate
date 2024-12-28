import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { configureMicrosoftSSO } from '@/lib/auth/sso/microsoft';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const configSchema = z.object({
  clientId: z.string().min(1, 'Client ID is required'),
  clientSecret: z.string().min(1, 'Client Secret is required'),
  tenantId: z.string().min(1, 'Tenant ID is required'),
});

type ConfigFormData = z.infer<typeof configSchema>;

interface MicrosoftSSOConfigProps {
  organizationId: string;
  onConfigured?: () => void;
}

export function MicrosoftSSOConfig({ organizationId, onConfigured }: MicrosoftSSOConfigProps) {
  const [loading, setLoading] = useState(false);
  const form = useForm<ConfigFormData>({
    resolver: zodResolver(configSchema),
  });

  async function onSubmit(data: ConfigFormData) {
    try {
      setLoading(true);
      await configureMicrosoftSSO(organizationId, data);
      toast.success('Microsoft SSO configured successfully');
      onConfigured?.();
    } catch (error) {
      toast.error('Failed to configure Microsoft SSO');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configure Microsoft SSO</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application (Client) ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    From Azure Portal App Registration
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="clientSecret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Secret</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tenantId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Directory (Tenant) ID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Your Azure AD tenant ID
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving...' : 'Save Configuration'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}