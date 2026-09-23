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
        <main className="flex min-h-screen items-center justify-center bg-(--bg) px-4 py-8">
            <section className="
                    w-full
                    max-w-md
                    rounded-(--radius)
                    border
                    border-(--border)
                    bg-(--surface)
                    p-8
                    shadow-(--shadow)">

                <header className="mb-8">
                    <div className="
                            mb-5
                            inline-flex
                            items-center
                            rounded-(--radius-sm)
                            bg-(image:--gradient-main)
                            px-3
                            py-1.5
                            text-sm
                            font-bold
                            text-(--on-gradient)">
                        SprintHub
                    </div>
                        <h1 className="text-2xL font-bold text-(--text)">
                            {title}
                        </h1>
                        <p className="mt-2 text-sm text-(--text-light)">
                            {description}
                        </p>
                </header>

                {children}

                {footer && (
                    <footer className="mt-6 text-center text-sm text-(--text-light)">
                        {footer}
                    </footer>
                )}

            </section>   
        </main>
    );
}

export default AuthFormLayout;