import { supabase } from '../supabase';

export interface UsageAlert {
  id: string;
  organizationId: string;
  metric: string;
  threshold: number;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function createUsageAlert(data: Omit<UsageAlert, 'id' | 'createdAt' | 'updatedAt'>) {
  const { data: alert, error } = await supabase
    .from('usage_alerts')
    .insert({
      organization_id: data.organizationId,
      metric: data.metric,
      threshold: data.threshold,
      enabled: data.enabled,
    })
    .select()
    .single();

  if (error) throw error;
  return alert;
}

export async function updateUsageAlert(id: string, data: Partial<UsageAlert>) {
  const { data: alert, error } = await supabase
    .from('usage_alerts')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return alert;
}

export async function getUsageAlerts(organizationId: string) {
  const { data, error } = await supabase
    .from('usage_alerts')
    .select('*')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}