import { LoadingSpinner } from './loading-spinner';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
      <LoadingSpinner size="lg" className="mb-4" />
      <p>{message}</p>
    </div>
  );
}