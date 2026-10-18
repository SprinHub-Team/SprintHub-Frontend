import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import styles from '../StateCard.module.css';

export interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn(styles.card, className)}>
      <span aria-hidden="true" className={styles.icon}>
        {icon}
      </span>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}
