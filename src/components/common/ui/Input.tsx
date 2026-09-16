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
                    className="block text-sm font-medium text-[var(--text)]"
                >
                    {label}
                </label>
            )}

            <input
            id={id}
            className={`
                    w-full
                    rounded-[var(--radius-sm)]
                    border
                    bg-[var(--surface)]
                    px-3
                    py-2.5
                    text-[var(--text)]
                    outline-none
                    placeholder:text-[var(--text-light)]
                    transition-[border-color, box-shadow]
                    duration-200
                    focus:border-[var(--secondary)]
                    focus:ring-2
                    focus:ring-[var(--secondary)]
                    focus:ring-opacity-20
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    ${error ? 'border-[var(--danger)]' : 'border-[var(--border)]'}
                    ${className}
            `}
                {...props}
            />
                {error &&(
                    <p className="text-sm text-[var(--danger)]">
                        {error}
                    </p>
                )}
        </div>
    );
}

export default Input;