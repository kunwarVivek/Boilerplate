import { supabase } from '../supabase';

export interface DomainVerification {
  domain: string;
  verified: boolean;
  verificationToken: string;
  dnsRecords: {
    type: string;
    name: string;
    value: string;
  }[];
}

export async function addCustomDomain(organizationId: string, domain: string) {
  // Generate verification token
  const verificationToken = `verify_${Math.random().toString(36).substring(2)}`;

  const { data, error } = await supabase
    .from('custom_domains')
    .insert({
      organization_id: organizationId,
      domain,
      verification_token: verificationToken,
      verified: false
    })
    .select()
    .single();

  if (error) throw error;

  return {
    domain,
    verified: false,
    verificationToken,
    dnsRecords: [
      {
        type: 'TXT',
        name: `_verify.${domain}`,
        value: verificationToken
      },
      {
        type: 'CNAME',
        name: domain,
        value: `${organizationId}.yourdomain.com`
      }
    ]
  };
}

export async function verifyDomain(organizationId: string, domain: string) {
  // In a real implementation, this would check DNS records
  const verified = true;

  const { error } = await supabase
    .from('custom_domains')
    .update({ verified })
    .eq('organization_id', organizationId)
    .eq('domain', domain);

  if (error) throw error;

  return verified;
}

export async function removeDomain(organizationId: string, domain: string) {
  const { error } = await supabase
    .from('custom_domains')
    .delete()
    .eq('organization_id', organizationId)
    .eq('domain', domain);

  if (error) throw error;
}