import type { ReactNode } from "react";
import { Link, type LinkProps } from 'react-router-dom';

type ButtonLinkVariant =
 |'primary'
 |'secondary'
 |'ghost'
 |'danger';

interface ButtonLinkProps extends LinkProps{
    variant?: ButtonLinkVariant;
    children: ReactNode;
    className?: string
}

const variantClasses: Record<ButtonLinkVariant, string> = {
    primary: 'bg-(--primary) text-white hover:bg-(-primary-dark)',
    secondary: 'bg-(--secondary) text-(--on-gradient) hover:brightness-110',
    ghost: 'bg-transparent text-(--text) hover:bg-(--surface-2)',
    danger: 'bg-(--danger) text-white hover:brightness-110'
};

function ButtonLink({variant = 'primary', children, className = '', ...props}: ButtonLinkProps){
    return(
        <Link
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
                hover:-translate-y-0.5 
                focus:outline-none 
                focus:ring-2 
                focus:ring-(--secondary) 
                focus:ring-offset-2 
                focus:ring-offset-(--bg)
                ${variantClasses[variant]}
                ${className}`}
                {...props}
        >
            {children}
        </Link>
    );
}

export default ButtonLink;