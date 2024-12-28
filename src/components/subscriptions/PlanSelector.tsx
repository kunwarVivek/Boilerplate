import { useState } from 'react';
import { PlanCard } from './PlanCard';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const PLANS = [
  {
    name: 'Starter',
    description: 'Perfect for small teams getting started',
    price: {
      monthly: 29,
      yearly: 290,
    },
    features: [
      { name: 'Up to 5 team members', included: true },
      { name: 'Basic team management', included: true },
      { name: 'Standard support', included: true },
      { name: 'Advanced permissions', included: false },
      { name: 'Custom branding', included: false },
      { name: 'Analytics', included: false },
    ],
  },
  {
    name: 'Professional',
    description: 'For growing teams with advanced needs',
    price: {
      monthly: 79,
      yearly: 790,
    },
    features: [
      { name: 'Up to 20 team members', included: true },
      { name: 'Advanced team management', included: true },
      { name: 'Priority support', included: true },
      { name: 'Advanced permissions', included: true },
      { name: 'Custom branding', included: true },
      { name: 'Analytics', included: false },
    ],
  },
  {
    name: 'Enterprise',
    description: 'For large organizations with custom requirements',
    price: {
      monthly: 199,
      yearly: 1990,
    },
    features: [
      { name: 'Unlimited team members', included: true },
      { name: 'Enterprise team management', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'Advanced permissions', included: true },
      { name: 'Custom branding', included: true },
      { name: 'Advanced Analytics', included: true },
    ],
  },
];

interface PlanSelectorProps {
  currentPlan?: string;
  onPlanSelect: (plan: string) => void;
}

export function PlanSelector({ currentPlan, onPlanSelect }: PlanSelectorProps) {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-center gap-4">
        <Label htmlFor="billing-cycle">Annual billing</Label>
        <Switch
          id="billing-cycle"
          checked={isYearly}
          onCheckedChange={setIsYearly}
        />
        <span className="text-sm text-muted-foreground">
          Save 20% with annual billing
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.name}
            {...plan}
            isCurrentPlan={currentPlan === plan.name}
            isYearly={isYearly}
            onSelect={() => onPlanSelect(plan.name)}
          />
        ))}
      </div>
    </div>
  );
}