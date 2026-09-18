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

    primary: 'bg-(--primary) text-white hover:bg-(--primary-dark)',
    secondary: 'bg-(--secondary)] text-(--on-gradient) hover:brightness-110',
    ghost: 'bg-transparent text-(--text)] hover:bg-(--surface-2)',
    danger: 'bg-(--danger) text-white hover:brightness-110'

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
                rounded-(--radius-sm)
                px-4
                py-2.5
                font-medium
                transition-[background-color,transform,box-shadow]
                duration-200
                ease-out
                focus:ring-2
                focus:ring-(--secondary)
                focus:ring-offset-2
                focus:ring-offset-(--bg)
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