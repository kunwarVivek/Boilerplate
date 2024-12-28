import { BillingForm } from './BillingForm';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { BillingSettingsFormData } from '@/lib/organizations/settings/types';

interface BillingFormWithErrorProps {
  organizationId: string;
  initialData: BillingSettingsFormData;
  onSubmit: (data: BillingSettingsFormData) => Promise<void>;
}

export function BillingFormWithError(props: BillingFormWithErrorProps) {
  return (
    <ErrorBoundary>
      <BillingForm {...props} />
    </ErrorBoundary>
  );
}