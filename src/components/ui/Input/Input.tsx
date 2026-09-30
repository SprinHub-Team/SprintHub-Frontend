import { useId, type InputHTMLAttributes, type Ref } from 'react';
import { CircleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  hideLabel?: boolean;
  ref?: Ref<HTMLInputElement>;
}

export function Input({
  label,
  error,
  hint,
  hideLabel = false,
  className,
  id,
  disabled,
  required,
  ref,
  ...restProps
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  const describedBy = [error ? errorId : null, hint && !error ? hintId : null]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="flex w-full flex-col gap-2">
      <label
        htmlFor={inputId}
        className={cn(
          'text-sm font-medium text-(--text-on-dark)',
          hideLabel && 'sr-only',
        )}
      >
        {label}
        {required ? (
          <span className="ml-1 text-(--taupe)" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      <input
        id={inputId}
        className={cn(
          'h-11 w-full rounded-(--radius-sm) border bg-(--ink-soft) px-4 text-sm text-(--text-on-dark)',
          'placeholder:text-(--taupe)',
          'transition-[border-color,box-shadow] duration-200 ease-out',
          'focus:border-(--sand) focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-(--sand)',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error
            ? 'border-(--sand) bg-(--ink-soft)'
            : 'border-(--border-subtle) hover:border-(--border-dark)',
          className,
        )}
        disabled={disabled}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        ref={ref}
        {...restProps}
      />

      {error ? (
        <p
          id={errorId}
          className="flex items-start gap-1.5 text-sm text-(--cream)"
          role="alert"
        >
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-(--sand)" />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p id={hintId} className="text-sm text-(--text-muted)">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
