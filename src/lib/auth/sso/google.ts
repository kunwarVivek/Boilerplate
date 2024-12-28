import { supabase } from '@/lib/supabase';
import { Provider } from '@supabase/supabase-js';

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      scopes: 'email profile https://www.googleapis.com/auth/admin.directory.user.readonly',
    },
  });

  if (error) throw error;
  return data;
}

export async function configureGoogleSSO(organizationId: string, config: {
  clientId: string;
  clientSecret: string;
  domain?: string;
}) {
  const { error } = await supabase
    .from('sso_configurations')
    .upsert({
      organization_id: organizationId,
      provider: 'google',
      client_id: config.clientId,
      client_secret: config.clientSecret,
      domain: config.domain,
      enabled: true,
    });

  if (error) throw error;
}