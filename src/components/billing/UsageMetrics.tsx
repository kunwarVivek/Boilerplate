import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle } from 'lucide-react';

interface UsageMetric {
  name: string;
  current: number;
  limit: number;
  unit: string;
  description?: string;
}

interface UsageMetricsProps {
  metrics: UsageMetric[];
}

export function UsageMetrics({ metrics }: UsageMetricsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric, index) => {
        const percentage = (metric.current / metric.limit) * 100;
        const isWarning = percentage > 80;
        const isCritical = percentage > 90;
        
        return (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={cn(
              "transition-all duration-200",
              isCritical && "border-destructive/50"
            )}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {metric.name}
                  {metric.description && (
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        {metric.description}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </CardTitle>
                <motion.span 
                  className="text-sm text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {metric.current.toLocaleString()} / {metric.limit.toLocaleString()} {metric.unit}
                </motion.span>
              </CardHeader>
              <CardContent>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Progress
                    value={percentage}
                    className={cn(
                      "transition-colors",
                      isCritical && "text-destructive",
                      isWarning && "text-warning"
                    )}
                  />
                </motion.div>
                {(isWarning || isCritical) && (
                  <motion.p
                    className={cn(
                      "mt-2 text-sm",
                      isCritical ? "text-destructive" : "text-warning"
                    )}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {isCritical ? 'Critical: Usage limit almost reached' : 'Warning: Approaching usage limit'}
                  </motion.p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}