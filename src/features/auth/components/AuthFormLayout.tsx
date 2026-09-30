import type { ReactNode } from 'react';
import { KanbanSquare } from 'lucide-react';

export interface AuthFormLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthFormLayout({ title, description, children, footer }: AuthFormLayoutProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-(image:--gradient-ink) px-4 py-10">
      <div className="flex flex-col items-center gap-3 text-center">
        <span
          aria-hidden="true"
          className="flex size-14 items-center justify-center rounded-(--radius) border border-(--border-light) bg-(image:--gradient-main) text-(--brown) shadow-(--shadow)"
        >
          <KanbanSquare className="size-7" />
        </span>
        <p className="text-sm font-semibold tracking-[0.2em] text-(--taupe) uppercase">
          SprintHub
        </p>
      </div>

      <section
        className="w-full max-w-md rounded-(--radius) border border-(--border-subtle) bg-(--ink-raised) px-6 py-8 shadow-(--shadow) sm:px-8"
        aria-labelledby="auth-form-title"
      >
        <div className="mb-6 flex flex-col gap-2 text-center">
          <h1 id="auth-form-title" className="text-2xl font-semibold text-(--text-on-dark)">
            {title}
          </h1>
          <p className="text-sm leading-relaxed text-(--text-muted)">{description}</p>
        </div>
        {children}
      </section>

      {footer ? (
        <footer className="text-sm text-(--text-muted)">{footer}</footer>
      ) : null}
    </main>
  );
}
