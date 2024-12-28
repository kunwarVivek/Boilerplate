import { supabase } from '../supabase';
import { OAuthProvider } from '@supabase/supabase-js';

export async function signInWithSSO(
  provider: OAuthProvider,
  options?: { redirectTo?: string }
) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: options?.redirectTo,
      scopes: getProviderScopes(provider),
    },
  });

  if (error) throw error;
  return data;
}

function getProviderScopes(provider: OAuthProvider): string {
  switch (provider) {
    case 'google':
      return 'email profile https://www.googleapis.com/auth/admin.directory.user.readonly';
    case 'azure':
      return 'email profile User.Read';
    default:
      return 'email profile';
  }
}

export async function configureSSOProvider(organizationId: string, data: {
  provider: 'google' | 'azure';
  clientId: string;
  clientSecret: string;
  domain?: string;
}) {
  const { error } = await supabase
    .from('sso_configurations')
    .upsert({
      organization_id: organizationId,
      provider: data.provider,
      client_id: data.clientId,
      client_secret: data.clientSecret,
      domain: data.domain,
      enabled: true,
    });

  if (error) throw error;
}