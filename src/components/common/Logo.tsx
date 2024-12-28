import { Bolt } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, size = 'md' }: LogoProps) {
  const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="p-2 bg-primary rounded-lg">
        <Bolt className={cn('text-primary-foreground', sizes[size])} />
      </div>
      <span className={cn(
        'font-bold tracking-tight',
        size === 'sm' && 'text-lg',
        size === 'md' && 'text-xl',
        size === 'lg' && 'text-2xl'
      )}>
        Enterprise
      </span>
    </div>
  );
}