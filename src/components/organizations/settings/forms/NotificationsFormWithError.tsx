import { NotificationsForm } from './NotificationsForm';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { NotificationSettingsFormData } from '@/lib/organizations/settings/types';

interface NotificationsFormWithErrorProps {
  organizationId: string;
  initialData: NotificationSettingsFormData;
  onSubmit: (data: NotificationSettingsFormData) => Promise<void>;
}

export function NotificationsFormWithError(props: NotificationsFormWithErrorProps) {
  return (
    <ErrorBoundary>
      <NotificationsForm {...props} />
    </ErrorBoundary>
  );
}