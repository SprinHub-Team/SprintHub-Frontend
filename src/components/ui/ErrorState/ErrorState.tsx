import { CircleAlert } from 'lucide-react';
import { Button } from '../Button/Button';
import { cn } from '@/lib/utils';

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
    <div
      role="alert"
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
        <CircleAlert className="size-8" />
      </span>
      <div className="flex max-w-md flex-col gap-2">
        <h3 className="text-lg font-semibold text-(--text-on-dark)">{title}</h3>
        <p className="text-sm leading-relaxed text-(--text-muted)">{message}</p>
      </div>
      {onRetry ? (
        <Button variant="secondary" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}
