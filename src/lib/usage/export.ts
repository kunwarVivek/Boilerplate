import { supabase } from '../supabase';

export async function exportUsageData(
  organizationId: string,
  startDate: Date,
  endDate: Date
) {
  const { data, error } = await supabase
    .from('usage_records')
    .select('*')
    .eq('organization_id', organizationId)
    .gte('recorded_at', startDate.toISOString())
    .lte('recorded_at', endDate.toISOString())
    .order('recorded_at', { ascending: true });

  if (error) throw error;

  // Convert to CSV
  const headers = ['Feature', 'Quantity', 'Recorded At'];
  const rows = data.map(record => [
    record.feature,
    record.quantity,
    new Date(record.recorded_at).toLocaleString()
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  // Create and download file
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `usage-data-${startDate.toISOString().split('T')[0]}-to-${endDate.toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}