import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Activity, Clock } from 'lucide-react';

interface Metric {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

interface UsageMetricsProps {
  metrics: Metric[];
}

export function UsageMetrics({ metrics }: UsageMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.title}
            </CardTitle>
            {metric.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className={`text-xs ${
              metric.change > 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {metric.change > 0 ? '+' : ''}{metric.change}% from last period
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}