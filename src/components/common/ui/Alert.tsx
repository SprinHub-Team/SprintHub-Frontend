import type { ReactNode } from 'react';

type AlertVariant =
    | "success"
    | "warning"
    | "danger"
    | "info";

interface AlertProps {
    variant?: AlertVariant;
    children: ReactNode;
}

const variantClasses: Record<AlertVariant, string> = {
    success: 'border-[var(--success-border)] bg-[var(--success-bg)] text-[var(--warning)]',
    warning: 'border-[var(--warning-border)] bg-[var(--warning)] text-[var(--warning)]',
    danger: 'border-[var(--danger-border)] bg-[var(--danger-bg)] text-[var(--danger)]',
    info: 'border-[var(--border-strong)] bg-[var(--surface-2)] text-[(--info)]'

};

function Alert({variant='info', children}:AlertProps){
    return(
        <div
          role='alert'
          className={`
            rounded-[var(--radius-sm)]
            border
            p-3
            text-sm
            ${variantClasses[variant]}
          `}
        >
            {children}
        </div>
    );
}

export default Alert;
