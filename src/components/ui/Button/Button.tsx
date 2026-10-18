import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
  danger: styles.danger,
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  type = 'button',
  ...restProps
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        styles.button,
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled === true || loading}
      aria-busy={loading || undefined}
      {...restProps}
    >
      {loading ? <Loader2 aria-hidden="true" className={styles.spinner} /> : icon}
      <span>{children}</span>
    </button>
  );
}
