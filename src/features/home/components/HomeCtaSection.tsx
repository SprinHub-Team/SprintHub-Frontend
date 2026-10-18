import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button/Button';
import { ROUTES } from '@/app/routes';
import styles from './HomeCtaSection.module.css';

export function HomeCtaSection() {
  const navigate = useNavigate();

  return (
    <section aria-labelledby="cta-title" className={styles.section}>
      <div className={styles.card}>
        <h2 id="cta-title" className={styles.title}>
          Tu próximo proyecto empieza hoy
        </h2>
        <p className={styles.description}>
          Crea tu cuenta, arma tu grupo de trabajo y descubre lo fluido que puede
          ser colaborar cuando todo el equipo trabaja en armonia.
        </p>
        <div className={styles.actions}>
          <Button
            size="lg"
            variant="secondary"
            className={styles.primaryOnLight}
            icon={<ArrowRight aria-hidden="true" className="icon-md" />}
            onClick={() => navigate(ROUTES.register)}
          >
            Crear cuenta gratis
          </Button>
          <Button
            size="lg"
            variant="ghost"
            className={styles.ghostOnLight}
            onClick={() => navigate(ROUTES.login)}
          >
            Ya tengo cuenta
          </Button>
        </div>
      </div>
    </section>
  );
}
