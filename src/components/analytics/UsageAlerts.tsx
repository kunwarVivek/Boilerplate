import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Bell } from 'lucide-react';

interface UsageAlert {
  id: string;
  metric: string;
  threshold: number;
  enabled: boolean;
}

interface UsageAlertsProps {
  alerts: UsageAlert[];
  onUpdateAlert: (alert: UsageAlert) => Promise<void>;
}

export function UsageAlerts({ alerts, onUpdateAlert }: UsageAlertsProps) {
  const [updating, setUpdating] = useState<string | null>(null);

  async function handleUpdateAlert(alert: UsageAlert) {
    try {
      setUpdating(alert.id);
      await onUpdateAlert(alert);
    } finally {
      setUpdating(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Usage Alerts
        </CardTitle>
        <CardDescription>
          Get notified when usage exceeds specified thresholds
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <p className="font-medium">{alert.metric}</p>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={alert.threshold}
                    onChange={(e) => handleUpdateAlert({
                      ...alert,
                      threshold: parseInt(e.target.value),
                    })}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">% threshold</span>
                </div>
              </div>
              <Switch
                checked={alert.enabled}
                disabled={updating === alert.id}
                onCheckedChange={(enabled) => handleUpdateAlert({
                  ...alert,
                  enabled,
                })}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}