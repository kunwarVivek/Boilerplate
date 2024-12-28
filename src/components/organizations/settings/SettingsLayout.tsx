import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GeneralSettings } from './GeneralSettings';
import { SecuritySettings } from './SecuritySettings';
import { DomainSettings } from './DomainSettings';
import { Organization } from '@/types';
import { OrganizationSettings } from '@/lib/organizations/settings';

interface SettingsLayoutProps {
  organization: Organization;
  settings: OrganizationSettings;
}

export function SettingsLayout({ organization, settings }: SettingsLayoutProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Organization Settings</h2>
        <p className="text-muted-foreground">
          Manage your organization's settings and preferences.
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="domains">Domains</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <GeneralSettings organization={organization} />
        </TabsContent>
        
        <TabsContent value="security">
          <SecuritySettings
            organizationId={organization.id}
            settings={settings.securitySettings}
          />
        </TabsContent>
        
        <TabsContent value="domains">
          <DomainSettings
            organizationId={organization.id}
            settings={{
              requireEmailDomain: settings.requireEmailDomain,
              allowedEmailDomains: settings.allowedEmailDomains,
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}