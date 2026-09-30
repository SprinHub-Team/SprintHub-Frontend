import { cn } from '@/lib/utils';

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = 'Cargando…', className }: LoadingStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex w-full flex-col items-center justify-center gap-4 rounded-(--radius)',
        'border border-(--border-subtle) bg-(--ink-raised) px-6 py-14',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="size-8 animate-spin rounded-full border-2 border-(--border-subtle) border-t-(--sand)"
      />
      <p className="text-sm text-(--text-muted)">{message}</p>
    </div>
  );
}
