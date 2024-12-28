import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PlanFeature {
  name: string;
  included: boolean;
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
  onSelect: () => void;
}

export function PlanCard({
  name,
  description,
  price,
  features,
  isCurrentPlan,
  isYearly,
  onSelect,
}: PlanCardProps) {
  const displayPrice = isYearly ? price.yearly : price.monthly;
  
  return (
    <Card className={cn(
      "flex flex-col",
      isCurrentPlan && "border-primary"
    )}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {name}
          {isCurrentPlan && (
            <span className="text-sm font-normal text-muted-foreground">
              Current Plan
            </span>
          )}
        </CardTitle>
        <div className="text-3xl font-bold">
          ${displayPrice}
          <span className="text-sm font-normal text-muted-foreground">
            /{isYearly ? 'year' : 'month'}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-2">
              <Check className={cn(
                "h-4 w-4",
                feature.included ? "text-primary" : "text-muted-foreground"
              )} />
              <span className={cn(
                "text-sm",
                !feature.included && "text-muted-foreground"
              )}>
                {feature.name}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={isCurrentPlan ? "outline" : "default"}
          onClick={onSelect}
        >
          {isCurrentPlan ? 'Current Plan' : 'Select Plan'}
        </Button>
      </CardFooter>
    </Card>
  );
}