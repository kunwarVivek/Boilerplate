import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BrandingEditor } from './BrandingEditor';
import { BrandingPreview } from './BrandingPreview';
import { useTenant } from '@/lib/tenant/TenantContext';

interface BrandingSettingsProps {
  organizationId: string;
}

export function BrandingSettings({ organizationId }: BrandingSettingsProps) {
  const { theme } = useTenant();
  const [activeTab, setActiveTab] = useState('editor');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Brand Settings</h2>
        <p className="text-muted-foreground">
          Customize your organization's branding and appearance.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="editor">Editor</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="editor">
          <BrandingEditor
            organizationId={organizationId}
            initialData={{
              primaryColor: theme.primaryColor,
              accentColor: theme.secondaryColor,
              logoUrl: theme.logoUrl,
              faviconUrl: theme.faviconUrl,
            }}
          />
        </TabsContent>

        <TabsContent value="preview">
          <BrandingPreview
            primaryColor={theme.primaryColor}
            accentColor={theme.secondaryColor}
            logoUrl={theme.logoUrl}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}