import type { ReactNode } from "react";

interface AuthFormLayoutProps{
    title: string;
    description: string;
    children: ReactNode;
    footer: ReactNode;
}

function AuthFormLayout({
    title,
    description,
    children,
    footer
}: AuthFormLayoutProps){
    return(
        <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] px-4 py-8">
            <section className="
                    w-full
                    max-w-md
                    rounded-[var(--radius)]
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                    p-8
                    shadow-[var(--shadow)]">

                <header className="mb-8">
                    <div className="
                            mb-5
                            inline-flex
                            items-center
                            rounded-[var(--radius-sm)]
                            bg-[image:var(--gradient-main)]
                            px-3
                            py-1.5
                            text-sm
                            font-bold
                            text-[color:var(--on-gradient)]">
                        SprintHub
                    </div>
                        <h1 className="text-2x1 font-bold text-[var(--text)]">
                            {title}
                        </h1>
                        <p className="mt-2 text-sm text-[var(--text-light)]">
                            {description}
                        </p>
                </header>

                {children}

                {footer && (
                    <footer className="mt-6 text-center text-sm text-[var(--text-light)]">
                        {footer}
                    </footer>
                )}

            </section>   
        </main>
    );
}

export default AuthFormLayout;