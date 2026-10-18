import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './Spinner.module.css';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

const sizeClasses = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

export function Spinner({ size = 'md', label = 'Cargando', className }: SpinnerProps) {
  return (
    <span role="status" aria-live="polite" className={styles.wrapper}>
      <Loader2 aria-hidden="true" className={cn(styles.spinner, sizeClasses[size], className)} />
      <span className="sr-only">{label}</span>
    </span>
  );
}
