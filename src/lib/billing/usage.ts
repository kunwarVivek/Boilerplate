```typescript
import { supabase } from '../supabase';

export async function trackUsage(organizationId: string, feature: string, quantity: number = 1) {
  const { error } = await supabase
    .from('usage_records')
    .insert({
      organization_id: organizationId,
      feature,
      quantity,
      recorded_at: new Date().toISOString()
    });

  if (error) throw error;
}

export async function getUsageSummary(organizationId: string) {
  const { data, error } = await supabase
    .from('usage_records')
    .select('feature, quantity, recorded_at')
    .eq('organization_id', organizationId)
    .gte('recorded_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  if (error) throw error;
  return data;
}
```