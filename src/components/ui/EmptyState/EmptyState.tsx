import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center gap-4 rounded-(--radius)',
        'border border-(--border-subtle) bg-(--ink-raised) px-6 py-14 text-center',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="flex size-16 items-center justify-center rounded-full border border-(--border-subtle) bg-(--ink-soft) text-(--sand)"
      >
        {icon}
      </span>
      <div className="flex max-w-md flex-col gap-2">
        <h3 className="text-lg font-semibold text-(--text-on-dark)">{title}</h3>
        <p className="text-sm leading-relaxed text-(--text-muted)">{description}</p>
      </div>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
