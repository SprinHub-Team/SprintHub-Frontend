import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
    label?: string;
    error?: string;
}

function Input({label, error, id, className = '', ...props}: InputProps){
    return(
        <div className="space-y-1.5">
            {label && (
                <label
                    htmlFor={id}
                    className="block text-sm font-medium text-(--text)"
                >
                    {label}
                </label>
            )}

            <input
            id={id}
            className={`
                    w-full
                    rounded-(--radius-sm)
                    border
                    bg-(--surface)
                    px-3
                    py-2.5
                    text-(--text)
                    outline-none
                    placeholder:text-(--text-light)
                    transition-[border-color, box-shadow]
                    duration-200
                    focus:border(--secondary)
                    focus:ring-2
                    focus:ring-(--secondary)
                    focus:ring-opacity-20
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    ${error ? 'border-(--danger)' : 'border-(--border)'}
                    ${className}
            `}
                {...props}
            />
                {error &&(
                    <p className="text-sm text-(--danger)">
                        {error}
                    </p>
                )}
        </div>
    );
}

export default Input;