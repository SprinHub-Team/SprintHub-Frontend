import type { ReactNode } from 'react';
import { KanbanSquare } from 'lucide-react';
import styles from './AuthFormLayout.module.css';

export interface AuthFormLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthFormLayout({ title, description, children, footer }: AuthFormLayoutProps) {
  return (
    <main className={styles.page}>
      <div className={styles.brand}>
        <span aria-hidden="true" className={styles.brandIcon}>
          <KanbanSquare className={styles.brandIconGlyph} />
        </span>
        <p className={styles.brandName}>
          SprintHub
        </p>
      </div>

      <section
        className={styles.card}
        aria-labelledby="auth-form-title"
      >
        <div className={styles.cardHeader}>
          <h1 id="auth-form-title" className={styles.cardTitle}>
            {title}
          </h1>
          <p className={styles.cardDescription}>{description}</p>
        </div>
        {children}
      </section>

      {footer ? (
        <footer className={styles.footer}>{footer}</footer>
      ) : null}
    </main>
  );
}
