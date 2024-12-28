import { useState, useEffect } from 'react';
import { UsageChart } from '../analytics/UsageChart';
import { UsageMetrics } from '../analytics/UsageMetrics';
import { getUsageMetrics, getUsageSummary } from '@/lib/usage/tracking';
import { Activity, Users, Clock } from 'lucide-react';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface UsageDashboardProps {
  organizationId: string;
}

export function UsageDashboard({ organizationId }: UsageDashboardProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [usageData, setUsageData] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any[]>([]);

  useEffect(() => {
    async function loadUsageData() {
      try {
        const [metricsData, usageData] = await Promise.all([
          getUsageSummary(organizationId),
          getUsageMetrics(organizationId, timeRange),
        ]);

        setUsageData(usageData);
        
        // Calculate changes
        const calculateChange = (current: number, previous: number) => 
          previous ? ((current - previous) / previous) * 100 : 0;

        setMetrics([
          {
            title: 'Active Users',
            value: metricsData.current.activeUsers || 0,
            change: calculateChange(
              metricsData.current.activeUsers || 0,
              metricsData.previous.activeUsers || 0
            ),
            icon: <Users className="h-4 w-4 text-muted-foreground" />,
          },
          {
            title: 'API Requests',
            value: metricsData.current.apiRequests?.toLocaleString() || 0,
            change: calculateChange(
              metricsData.current.apiRequests || 0,
              metricsData.previous.apiRequests || 0
            ),
            icon: <Activity className="h-4 w-4 text-muted-foreground" />,
          },
          {
            title: 'Average Session Time',
            value: `${Math.round(metricsData.current.sessionTime || 0)}m`,
            change: calculateChange(
              metricsData.current.sessionTime || 0,
              metricsData.previous.sessionTime || 0
            ),
            icon: <Clock className="h-4 w-4 text-muted-foreground" />,
          },
        ]);
      } catch (error) {
        console.error('Failed to load usage data:', error);
      }
    }

    loadUsageData();
  }, [organizationId, timeRange]);

  return (
    <div className="space-y-8">
      <ErrorBoundary>
        <UsageMetrics metrics={metrics} />
      </ErrorBoundary>

      <ErrorBoundary>
        <div className="grid gap-6 md:grid-cols-2">
          <UsageChart
            title="API Usage"
            data={usageData}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
          <UsageChart
            title="Active Users"
            data={usageData}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
        </div>
      </ErrorBoundary>
    </div>
  );
}