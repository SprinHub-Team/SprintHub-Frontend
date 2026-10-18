import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import styles from './Badge.module.css';

export type BadgeTone = 'neutral' | 'outline' | 'filled' | 'muted';

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  icon?: ReactNode;
  className?: string;
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: styles.neutral,
  outline: styles.outline,
  filled: styles.filled,
  muted: styles.muted,
};

export function Badge({ children, tone = 'neutral', icon, className }: BadgeProps) {
  return (
    <span
      className={cn(
        styles.badge,
        toneClasses[tone],
        className,
      )}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
}
