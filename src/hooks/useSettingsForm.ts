import { useState } from 'react';
import { toast } from 'sonner';
import { UseFormReturn } from 'react-hook-form';

interface UseSettingsFormProps<T> {
  onSubmit: (data: T) => Promise<void>;
}

export function useSettingsForm<T>({ onSubmit }: UseSettingsFormProps<T>) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(data: T) {
    try {
      setLoading(true);
      await onSubmit(data);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Failed to update settings');
      console.error('Settings update error:', error);
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    handleSubmit,
  };
}