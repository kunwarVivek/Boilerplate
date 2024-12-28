import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GoogleSSOConfig } from './GoogleSSOConfig';
import { MicrosoftSSOConfig } from './MicrosoftSSOConfig';

interface SSOConfigurationProps {
  organizationId: string;
  onConfigured?: () => void;
}

export function SSOConfiguration({ organizationId, onConfigured }: SSOConfigurationProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">SSO Configuration</h2>
        <p className="text-muted-foreground">
          Configure Single Sign-On providers for your organization.
        </p>
      </div>

      <Tabs defaultValue="google" className="space-y-4">
        <TabsList>
          <TabsTrigger value="google">Google Workspace</TabsTrigger>
          <TabsTrigger value="microsoft">Microsoft 365</TabsTrigger>
        </TabsList>
        
        <TabsContent value="google">
          <GoogleSSOConfig 
            organizationId={organizationId} 
            onConfigured={onConfigured} 
          />
        </TabsContent>
        
        <TabsContent value="microsoft">
          <MicrosoftSSOConfig 
            organizationId={organizationId} 
            onConfigured={onConfigured} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}