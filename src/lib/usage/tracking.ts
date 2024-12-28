import { supabase } from '../supabase';

export async function trackUsage(organizationId: string, feature: string, quantity: number = 1) {
  const { error } = await supabase
    .from('usage_records')
    .insert({
      organization_id: organizationId,
      feature,
      quantity,
    });

  if (error) throw error;
}

export async function getUsageMetrics(organizationId: string, timeRange: '7d' | '30d' | '90d') {
  const { data, error } = await supabase
    .from('usage_records')
    .select('feature, quantity, recorded_at')
    .eq('organization_id', organizationId)
    .gte('recorded_at', new Date(Date.now() - getDaysInMs(timeRange)).toISOString())
    .order('recorded_at', { ascending: true });

  if (error) throw error;
  return data;
}

function getDaysInMs(range: '7d' | '30d' | '90d'): number {
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  return days * 24 * 60 * 60 * 1000;
}

export async function getUsageSummary(organizationId: string) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();

  const [currentPeriod, previousPeriod] = await Promise.all([
    supabase
      .from('usage_records')
      .select('feature, quantity')
      .eq('organization_id', organizationId)
      .gte('recorded_at', thirtyDaysAgo),
    supabase
      .from('usage_records')
      .select('feature, quantity')
      .eq('organization_id', organizationId)
      .gte('recorded_at', sixtyDaysAgo)
      .lt('recorded_at', thirtyDaysAgo),
  ]);

  if (currentPeriod.error || previousPeriod.error) {
    throw new Error('Failed to fetch usage data');
  }

  return {
    current: aggregateUsage(currentPeriod.data),
    previous: aggregateUsage(previousPeriod.data),
  };
}

function aggregateUsage(records: any[]) {
  return records.reduce((acc, record) => {
    acc[record.feature] = (acc[record.feature] || 0) + record.quantity;
    return acc;
  }, {} as Record<string, number>);
}