import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant =
 | "primary"
 | "secondary"
 | "ghost"
 | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    variant?:ButtonVariant;
    children?:ReactNode;
    isLoading?:boolean;
}

const variantClasses: Record<ButtonVariant, string> = {

    primary: 'bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]',
    secondary: 'bg-[var(--secondary)] text-[var(--on-gradient)] hover:brightness-110',
    ghost: 'bg-transparent text-[var(--text)] hover:bg-[var(--surface-2)]',
    danger: 'bg-[var(--danger)] text-white hover:brightness-110'

}

function Button({variant='primary', children, isLoading, disabled, className='', ...props}: ButtonProps){
    return (
        <button
            disabled={disabled || isLoading}
            className={`
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-[var(--radius-sm)]
                px-4
                py-2.5
                font-medium
                transition-[background-color,transform,box-shadow]
                duration-200
                ease-out
                focus:ring-2
                focus:ring-[var(--secondary)]
                focus:ring-offset-2
                focus:ring-offset-[var(--bg)]
                disabled:opacity-50
                disabled:cursor-not-allowed
                ${variantClasses[variant]}
                ${className}
            `}
            {...props}
        >
            {isLoading ? 'Cargando...' : children}
        </button>
    );
}

export default Button;