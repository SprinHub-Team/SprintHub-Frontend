import { CircleAlert } from 'lucide-react';
import { Button } from '../Button/Button';
import { cn } from '@/lib/utils';
import styles from '../StateCard.module.css';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({
  title = 'Algo salió mal',
  message,
  onRetry,
  retryLabel = 'Reintentar',
  className,
}: ErrorStateProps) {
  return (
    <div role="alert" className={cn(styles.card, className)}>
      <span aria-hidden="true" className={styles.icon}>
        <CircleAlert className={styles.iconSize} />
      </span>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{message}</p>
      </div>
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
