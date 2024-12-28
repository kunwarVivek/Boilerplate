import { useCallback } from 'react';
import { toast } from 'sonner';

interface ErrorHandlerOptions {
  fallbackMessage?: string;
  showToast?: boolean;
  onError?: (error: Error) => void;
}

export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const handleError = useCallback((error: unknown) => {
    const errorMessage = error instanceof Error 
      ? error.message 
      : options.fallbackMessage || 'An unexpected error occurred';

    if (options.showToast) {
      toast.error(errorMessage);
    }

    console.error('Error:', error);
    options.onError?.(error instanceof Error ? error : new Error(errorMessage));

    return errorMessage;
  }, [options]);

  return handleError;
}