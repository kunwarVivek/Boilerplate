import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseAsyncActionOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useAsyncAction(options: UseAsyncActionOptions = {}) {
  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async (action: () => Promise<void>) => {
      try {
        setLoading(true);
        await action();
        if (options.successMessage) {
          toast.success(options.successMessage);
        }
        options.onSuccess?.();
      } catch (err) {
        const error = err instanceof Error ? err : new Error('An error occurred');
        if (options.errorMessage) {
          toast.error(options.errorMessage);
        }
        options.onError?.(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  return {
    loading,
    execute,
  };
}