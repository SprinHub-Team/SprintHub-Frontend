import { cn } from '@/lib/utils';
import styles from '../StateCard.module.css';

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = 'Cargando…', className }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(styles.card, className)}
    >
      <span aria-hidden="true" className={styles.spinner} />
      <p className={styles.description}>{message}</p>
    </div>
  );
}
