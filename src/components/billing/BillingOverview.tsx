import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlanCard } from './PlanCard';
import { InvoiceList } from './InvoiceList';
import { UsageMetrics } from './UsageMetrics';
import { PaymentMethodForm } from './PaymentMethodForm';

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
      { name: 'Basic analytics', included: true },
      { name: 'Standard support', included: true },
      { name: 'Custom domain', included: false },
      { name: 'SSO', included: false },
      { name: 'API access', included: false },
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
      { name: 'Advanced analytics', included: true },
      { name: 'Priority support', included: true },
      { name: 'Custom domain', included: true },
      { name: 'SSO', included: true },
      { name: 'API access', included: false },
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
      { name: 'Enterprise analytics', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'Custom domain', included: true },
      { name: 'SSO', included: true },
      { name: 'API access', included: true },
    ],
  },
];

interface BillingOverviewProps {
  organizationId: string;
  currentPlan: string;
}

export function BillingOverview({ organizationId, currentPlan }: BillingOverviewProps) {
  const [isYearly, setIsYearly] = useState(false);
  const [activeTab, setActiveTab] = useState('plans');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Billing & Usage</h2>
        <p className="text-muted-foreground">
          Manage your subscription, payment methods, and usage.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>

        <TabsContent value="plans">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setIsYearly(!isYearly)}
              >
                {isYearly ? 'Show Monthly' : 'Show Yearly'}
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {PLANS.map((plan) => (
                <PlanCard
                  key={plan.name}
                  {...plan}
                  isCurrentPlan={currentPlan === plan.name}
                  isYearly={isYearly}
                  onSelect={() => {
                    // TODO: Implement plan selection
                  }}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="usage">
          <UsageMetrics
            metrics={[
              {
                name: 'Team Members',
                current: 8,
                limit: 20,
                unit: 'members',
              },
              {
                name: 'Storage',
                current: 7.5,
                limit: 10,
                unit: 'GB',
              },
              {
                name: 'API Requests',
                current: 75000,
                limit: 100000,
                unit: 'requests',
              },
            ]}
          />
        </TabsContent>

        <TabsContent value="invoices">
          <InvoiceList
            invoices={[
              {
                id: '1',
                amount: 79,
                status: 'paid',
                dueDate: '2024-03-01',
                paidAt: '2024-02-28',
              },
              {
                id: '2',
                amount: 79,
                status: 'pending',
                dueDate: '2024-04-01',
              },
            ]}
            onDownload={(invoiceId) => {
              // TODO: Implement invoice download
            }}
          />
        </TabsContent>

        <TabsContent value="payment">
          <PaymentMethodForm
            onSubmit={async (data) => {
              // TODO: Implement payment method update
              console.log(data);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}