import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ColorPicker } from './ColorPicker';
import { LogoUpload } from './LogoUpload';
import { updateBranding } from '@/lib/organizations/branding';

const brandingSchema = z.object({
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color code'),
  accentColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid color code'),
});

type BrandingFormData = z.infer<typeof brandingSchema>;

interface BrandingEditorProps {
  organizationId: string;
  initialData: {
    primaryColor: string;
    accentColor: string;
    logoUrl?: string;
    faviconUrl?: string;
  };
}

export function BrandingEditor({ organizationId, initialData }: BrandingEditorProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<BrandingFormData>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      primaryColor: initialData.primaryColor,
      accentColor: initialData.accentColor,
    },
  });

  async function onSubmit(data: BrandingFormData) {
    try {
      setLoading(true);
      await updateBranding(organizationId, data);
      toast.success('Branding settings updated');
    } catch (error) {
      toast.error('Failed to update branding');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Logo & Favicon</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <LogoUpload
            type="logo"
            currentUrl={initialData.logoUrl}
            organizationId={organizationId}
          />
          <LogoUpload
            type="favicon"
            currentUrl={initialData.faviconUrl}
            organizationId={organizationId}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Brand Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="primaryColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primary Color</FormLabel>
                    <FormControl>
                      <ColorPicker {...field} />
                    </FormControl>
                    <FormDescription>
                      Used for primary buttons and key UI elements
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accentColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accent Color</FormLabel>
                    <FormControl>
                      <ColorPicker {...field} />
                    </FormControl>
                    <FormDescription>
                      Used for secondary elements and highlights
                    </FormDescription>
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}