import { ArrowRight, KanbanSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button/Button';
import { ROUTES } from '@/app/routes';
import styles from './HeroSection.module.css';

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className={styles.section}>
      <div aria-hidden="true" className={styles.sectionBackground} />
      <div className={styles.sectionInner}>
        <div className={styles.content}>
          <span className={styles.badge}>
            <KanbanSquare aria-hidden="true" className={styles.badgeIcon} />
            Tableros ágiles en tiempo real
          </span>

          <h1 className={styles.title}>
            Organiza tus sprints con{' '}
            <span className={styles.titleHighlight}>
              claridad total
            </span>
          </h1>

          <p className={styles.description}>
            SprintHub reúne tus espacios de trabajo en un solo lugar. Colabora con tu equipo al
            instante, con roles claros y tableros Kanban con las columnas listas
            desde el primer día.
          </p>

          <div className={styles.actions}>
            <Button
              size="lg"
              onClick={() => navigate(ROUTES.register)}
              icon={<ArrowRight aria-hidden="true" className="icon-md" />}
            >
              Crear cuenta gratis
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate(ROUTES.login)}
            >
              Iniciar sesión
            </Button>
          </div>
        </div>

        <BoardMockup />
      </div>
    </section>
  );
}

function BoardMockup() {
  return (
    <div aria-hidden="true" className={styles.mockup}>
      <div className={styles.mockupHeader}>
        <span className={styles.mockupIcon}>
          <KanbanSquare className="icon-md" />
        </span>
        <div className={styles.mockupTitle}>
          <span className={styles.mockupTitleBar} />
          <span className={styles.mockupSubtitleBar} />
        </div>
      </div>
      <div className={styles.mockupColumns}>
        {[
          { title: 'Por hacer', cards: ['Diseño de API', 'Modelo de datos'], tone: 'taupe' },
          { title: 'En proceso', cards: ['Autenticación JWT'], tone: 'sand' },
          { title: 'Hecho', cards: ['Contratos Zod', 'CI/CD'], tone: 'cream' },
        ].map((column) => (
          <div
            key={column.title}
            className={`${styles.mockupColumn} ${
              column.tone === 'taupe'
                ? styles.dotTaupe
                : column.tone === 'sand'
                  ? styles.dotSand
                  : styles.dotCream
            }`}
          >
            <div className={styles.mockupColumnHeader}>
              <span className={styles.mockupDot} />
              <span className={styles.mockupColumnTitle}>{column.title}</span>
            </div>
            {column.cards.map((card) => (
              <div key={card} className={styles.mockupCard}>
                <span className={styles.mockupCardBar} />
                <span className={styles.mockupCardBarShort} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
