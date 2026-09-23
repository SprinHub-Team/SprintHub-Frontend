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
    success: 'border-(--success-border) bg-(--success-bg) text-(--warning)',
    warning: 'border-(--warning-border) bg-(--warning) text-(--warning)',
    danger: 'border-(--danger-border) bg-[var(--danger-bg)] text-(--danger)',
    info: 'border-(--border-strong) bg-(--surface-2) text-(--info)'

};

function Alert({variant='info', children}:AlertProps){
    return(
        <div
          role='alert'
          className={`
            rounded-(--radius-sm)
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
