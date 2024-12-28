import { supabase } from '@/lib/supabase';

export async function signInWithMicrosoft() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'azure',
    options: {
      scopes: 'email profile User.Read',
      queryParams: {
        prompt: 'select_account',
      },
    },
  });

  if (error) throw error;
  return data;
}

export async function configureMicrosoftSSO(organizationId: string, config: {
  clientId: string;
  clientSecret: string;
  tenantId: string;
}) {
  const { error } = await supabase
    .from('sso_configurations')
    .upsert({
      organization_id: organizationId,
      provider: 'azure',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      metadata: { tenant_id: config.tenantId },
      enabled: true,
    });

  if (error) throw error;
}