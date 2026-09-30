import type { ReactNode } from 'react';
import { CheckCircle2, CircleAlert, Info, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  success: 'border-(--taupe) bg-(--ink-raised) text-(--cream)',
  warning: 'border-(--sand) bg-(--ink-raised) text-(--cream)',
  danger: 'border-(--taupe) bg-(--ink-raised) text-(--cream)',
  info: 'border-(--border-subtle) bg-(--ink-raised) text-(--text-on-dark)',
};

export function Alert({ variant, title, children, className }: AlertProps) {
  const Icon = icons[variant];

  return (
    <div
      role={variant === 'danger' ? 'alert' : 'status'}
      aria-live={variant === 'danger' ? 'assertive' : 'polite'}
      className={cn(
        'flex w-full items-start gap-3 rounded-(--radius-sm) border px-4 py-3.5',
        'shadow-(--shadow-soft)',
        variantClasses[variant],
        className,
      )}
    >
      <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-(--sand)" />
      <div className="flex min-w-0 flex-col gap-1">
        <p className="text-sm font-semibold">{title}</p>
        {children ? <div className="text-sm text-(--text-muted)">{children}</div> : null}
      </div>
    </div>
  );
}
