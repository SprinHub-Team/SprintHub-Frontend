import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  primary:
    'bg-(image:--gradient-main) text-(--brown) font-semibold border border-(--border-light) hover:shadow-(--shadow-hover) hover:brightness-[1.04] active:brightness-95',
  secondary:
    'bg-transparent text-(--text-on-dark) border border-(--border-dark) hover:bg-(--ink-raised) hover:border-(--sand) hover:text-(--cream)',
  ghost:
    'bg-transparent text-(--text-muted) border border-transparent hover:bg-(--ink-raised) hover:text-(--text-on-dark)',
  danger:
    'bg-(--brown) text-(--paper) border border-(--border-dark) hover:shadow-(--shadow-hover) hover:brightness-125',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm gap-1.5 rounded-(--radius-sm)',
  md: 'h-11 px-5 text-sm gap-2 rounded-(--radius-sm)',
  lg: 'h-12 px-7 text-base gap-2.5 rounded-(--radius-sm)',
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
        'inline-flex items-center justify-center whitespace-nowrap',
        'transition-[box-shadow,background-color,color,border-color,filter] duration-200 ease-out',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--sand)',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:saturate-50',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      disabled={disabled === true || loading}
      aria-busy={loading || undefined}
      {...restProps}
    >
      {loading ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : icon}
      <span>{children}</span>
    </button>
  );
}
