import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type BadgeTone = 'neutral' | 'outline' | 'filled' | 'muted';

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  icon?: ReactNode;
  className?: string;
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'border-(--border-subtle) bg-(--ink-soft) text-(--text-on-dark)',
  outline: 'border-(--border-dark) bg-transparent text-(--cream)',
  filled: 'border-(--border-light) bg-(image:--gradient-main) text-(--brown) font-semibold',
  muted: 'border-transparent bg-transparent text-(--text-muted)',
};

export function Badge({ children, tone = 'neutral', icon, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        'transition-colors duration-200 ease-out',
        toneClasses[tone],
        className,
      )}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
}
