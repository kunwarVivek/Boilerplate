import { useState, useCallback } from 'react';

interface UseRetryOptions {
  maxAttempts?: number;
  delayMs?: number;
}

export function useRetry({ maxAttempts = 3, delayMs = 1000 }: UseRetryOptions = {}) {
  const [attempts, setAttempts] = useState(0);

  const retry = useCallback(async <T>(
    operation: () => Promise<T>,
    shouldRetry: (error: Error) => boolean = () => true
  ): Promise<T> => {
    try {
      return await operation();
    } catch (error) {
      if (attempts < maxAttempts - 1 && shouldRetry(error instanceof Error ? error : new Error())) {
        setAttempts(prev => prev + 1);
        await new Promise(resolve => setTimeout(resolve, delayMs));
        return retry(operation, shouldRetry);
      }
      throw error;
    }
  }, [attempts, maxAttempts, delayMs]);

  const reset = useCallback(() => {
    setAttempts(0);
  }, []);

  return {
    attempts,
    retry,
    reset,
    hasMoreAttempts: attempts < maxAttempts,
  };
}