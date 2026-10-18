import { useId, type TextareaHTMLAttributes } from 'react';
import { CircleAlert } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from '../Field.module.css';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  hideLabel?: boolean;
}

export function TextArea({
  label,
  error,
  hint,
  hideLabel = false,
  className,
  id,
  disabled,
  required,
  rows = 3,
  ...restProps
}: TextAreaProps) {
  const generatedId = useId();
  const areaId = id ?? generatedId;
  const errorId = `${areaId}-error`;
  const hintId = `${areaId}-hint`;

  const describedBy = [error ? errorId : null, hint && !error ? hintId : null]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.wrapper}>
      <label
        htmlFor={areaId}
        className={cn(styles.label, hideLabel ? 'sr-only' : undefined)}
      >
        {label}
        {required ? (
          <span className={styles.required} aria-hidden="true">
            *
          </span>
        ) : null}
      </label>

      <textarea
        id={areaId}
        rows={rows}
        className={cn(
          styles.control,
          styles.textarea,
          error ? styles.controlError : styles.controlIdle,
          className,
        )}
        disabled={disabled}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy || undefined}
        {...restProps}
      />

      {error ? (
        <p id={errorId} className={styles.error} role="alert">
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
