import { useState, useCallback } from 'react';

interface UseLoadingStateResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  setLoading: () => void;
  setData: (data: T) => void;
  setError: (error: Error) => void;
  reset: () => void;
}

export function useLoadingState<T>(initialData: T | null = null): UseLoadingStateResult<T> {
  const [state, setState] = useState({
    data: initialData,
    loading: false,
    error: null as Error | null,
  });

  const setLoading = useCallback(() => {
    setState(prev => ({ ...prev, loading: true, error: null }));
  }, []);

  const setData = useCallback((data: T) => {
    setState({ data, loading: false, error: null });
  }, []);

  const setError = useCallback((error: Error) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  const reset = useCallback(() => {
    setState({ data: initialData, loading: false, error: null });
  }, [initialData]);

  return {
    ...state,
    setLoading,
    setData,
    setError,
    reset,
  };
}