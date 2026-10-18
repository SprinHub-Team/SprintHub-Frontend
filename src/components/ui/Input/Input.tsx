import { useId, type InputHTMLAttributes, type Ref } from 'react';
import { CircleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from '../Field.module.css';

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
    <div className={styles.wrapper}>
      <label
        htmlFor={inputId}
        className={cn(styles.label, hideLabel ? 'sr-only' : undefined)}
      >
        {label}
        {required ? (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      <input
        id={inputId}
        className={cn(
          styles.control,
          styles.input,
          error ? styles.controlError : styles.controlIdle,
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
          className={styles.error}
          role="alert"
        >
          <CircleAlert aria-hidden="true" className={styles.errorIcon} />
          <span>{error}</span>
        </p>
      ) : hint ? (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}
