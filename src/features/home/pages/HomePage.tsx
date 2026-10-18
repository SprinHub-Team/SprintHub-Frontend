import { KanbanSquare, LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button/Button';
import { ROUTES } from '@/app/routes';
import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { HomeCtaSection } from '../components/HomeCtaSection';
import styles from './HomePage.module.css';

/**
 * Landing pública: solo la ven invitados (PublicRoute redirige a los
 * usuarios con sesión directo al dashboard), por lo que sus CTAs son
 * siempre de registro e inicio de sesión.
 */
export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button
            type="button"
            onClick={() => navigate(ROUTES.home)}
            className={styles.brand}
            aria-label="SprintHub — ir al inicio"
          >
            <span aria-hidden="true" className={styles.brandIcon}>
              <KanbanSquare className="icon-lg" />
            </span>
            <span className={styles.brandName}>
              SprintHub
            </span>
          </button>

          <nav aria-label="Navegación principal" className={styles.nav}>
            <Button
              variant="ghost"
              size="sm"
              icon={<LogIn aria-hidden="true" className="icon-md" />}
              onClick={() => navigate(ROUTES.login)}
            >
              Iniciar sesión
            </Button>
            <Button
              size="sm"
              icon={<UserPlus aria-hidden="true" className="icon-md" />}
              onClick={() => navigate(ROUTES.register)}
            >
              Crear cuenta
            </Button>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <HomeCtaSection />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p className={styles.footerText}>
            SprintHub — Tableros ágiles en tiempo real para equipos que entregan.
          </p>
        </div>
      </footer>
    </div>
  );
}
