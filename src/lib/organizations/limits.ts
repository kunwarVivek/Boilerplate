import { supabase } from '../supabase';

export interface ResourceLimits {
  maxUsers: number;
  maxTeams: number;
  maxStorage: number; // in GB
  maxApiCalls: number;
}

const PLAN_LIMITS: Record<string, ResourceLimits> = {
  free: {
    maxUsers: 5,
    maxTeams: 2,
    maxStorage: 1,
    maxApiCalls: 1000
  },
  pro: {
    maxUsers: 20,
    maxTeams: 10,
    maxStorage: 10,
    maxApiCalls: 10000
  },
  enterprise: {
    maxUsers: 100,
    maxTeams: 50,
    maxStorage: 100,
    maxApiCalls: 100000
  }
};

export async function checkResourceLimit(
  organizationId: string,
  resource: keyof ResourceLimits
): Promise<boolean> {
  // Get organization's subscription tier
  const { data: subscription } = await supabase
    .from('organization_subscriptions')
    .select('tier_id')
    .eq('organization_id', organizationId)
    .single();

  if (!subscription) return false;

  const { data: tier } = await supabase
    .from('subscription_tiers')
    .select('name')
    .eq('id', subscription.tier_id)
    .single();

  const limits = PLAN_LIMITS[tier.name.toLowerCase()];
  if (!limits) return false;

  // Get current usage
  let currentUsage = 0;
  switch (resource) {
    case 'maxUsers':
      const { count: userCount } = await supabase
        .from('users')
        .select('id', { count: 'exact' })
        .eq('organization_id', organizationId);
      currentUsage = userCount || 0;
      break;

    case 'maxTeams':
      const { count: teamCount } = await supabase
        .from('teams')
        .select('id', { count: 'exact' })
        .eq('organization_id', organizationId);
      currentUsage = teamCount || 0;
      break;

    case 'maxStorage':
      const { data: storageData } = await supabase
        .from('usage_records')
        .select('quantity')
        .eq('organization_id', organizationId)
        .eq('feature', 'storage')
        .order('recorded_at', { ascending: false })
        .limit(1);
      currentUsage = storageData?.[0]?.quantity || 0;
      break;

    case 'maxApiCalls':
      const { data: apiData } = await supabase
        .from('usage_records')
        .select('quantity')
        .eq('organization_id', organizationId)
        .eq('feature', 'api_calls')
        .gte('recorded_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: false })
        .limit(1);
      currentUsage = apiData?.[0]?.quantity || 0;
      break;
  }

  return currentUsage < limits[resource];
}