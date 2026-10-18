import type { ReactNode } from 'react';
import { CheckCircle2, CircleAlert, Info, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './Alert.module.css';

export type AlertVariant = 'success' | 'warning' | 'danger' | 'info';

export interface AlertProps {
  variant: AlertVariant;
  title: string;
  children?: ReactNode;
  className?: string;
}

const icons: Record<AlertVariant, typeof Info> = {
  success: CheckCircle2,
  warning: TriangleAlert,
  danger: CircleAlert,
  info: Info,
};

const variantClasses: Record<AlertVariant, string> = {
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
  info: styles.info,
};

export function Alert({ variant, title, children, className }: AlertProps) {
  const Icon = icons[variant];

  return (
    <div
      role={variant === 'danger' ? 'alert' : 'status'}
      aria-live={variant === 'danger' ? 'assertive' : 'polite'}
      className={cn(styles.alert, variantClasses[variant], className)}
    >
      <Icon aria-hidden="true" className={styles.icon} />
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        {children ? <div className={styles.message}>{children}</div> : null}
      </div>
    </div>
  );
}
