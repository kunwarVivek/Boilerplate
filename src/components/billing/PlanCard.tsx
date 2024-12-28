import { Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PlanFeature {
  name: string;
  included: boolean;
  highlight?: boolean;
}

interface PlanCardProps {
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: PlanFeature[];
  isCurrentPlan?: boolean;
  isYearly?: boolean;
  isPopular?: boolean;
  onSelect: () => void;
}

export function PlanCard({
  name,
  description,
  price,
  features,
  isCurrentPlan,
  isYearly,
  isPopular,
  onSelect,
}: PlanCardProps) {
  const displayPrice = isYearly ? price.yearly : price.monthly;
  const savings = isYearly ? Math.round((1 - price.yearly / (price.monthly * 12)) * 100) : 0;
  
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn(
        "relative flex flex-col h-full transition-colors",
        isCurrentPlan && "border-primary shadow-lg",
        isPopular && "border-primary/50 shadow-md"
      )}>
        {isPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
              <Sparkles className="h-3.5 w-3.5" />
              Most Popular
            </span>
          </div>
        )}

        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{name}</span>
            {isCurrentPlan && (
              <motion.span 
                className="text-sm font-normal text-muted-foreground"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                Current Plan
              </motion.span>
            )}
          </CardTitle>
          <div className="mt-2">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">${displayPrice}</span>
              <span className="text-sm text-muted-foreground">
                /{isYearly ? 'year' : 'month'}
              </span>
            </div>
            {isYearly && savings > 0 && (
              <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                Save {savings}% with annual billing
              </p>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardHeader>

        <CardContent className="flex-1">
          <ul className="space-y-3">
            {features.map((feature, i) => (
              <motion.li
                key={i}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Check className={cn(
                  "h-4 w-4",
                  feature.included 
                    ? feature.highlight 
                      ? "text-primary" 
                      : "text-green-500"
                    : "text-muted-foreground"
                )} />
                <span className={cn(
                  "text-sm",
                  !feature.included && "text-muted-foreground",
                  feature.highlight && "font-medium"
                )}>
                  {feature.name}
                </span>
              </motion.li>
            ))}
          </ul>
        </CardContent>

        <CardFooter>
          <Button
            className={cn(
              "w-full transition-all",
              isPopular && !isCurrentPlan && "bg-primary hover:bg-primary/90"
            )}
            variant={isCurrentPlan ? "outline" : "default"}
            onClick={onSelect}
          >
            {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}