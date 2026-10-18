import { KanbanSquare, Radio, Users } from 'lucide-react';
import styles from './HowItWorksSection.module.css';

const STEPS = [
  {
    icon: Users,
    step: '1',
    title: 'Crea tu grupo de trabajo',
    description:
      'Define un espacio para tu equipo e invita a los miembros con el rol que corresponda.',
  },
  {
    icon: KanbanSquare,
    step: '2',
    title: 'Añade tableros',
    description:
      'Crea tableros con las columnas Por hacer, En proceso y Hecho ya preparadas.',
  },
  {
    icon: Radio,
    step: '3',
    title: 'Colabora en tiempo real',
    description:
      'Mueve tarjetas, ajusta prioridades y asigna responsables: todos verán los cambios al instante.',
  },
] as const;

export function HowItWorksSection() {
  return (
    <section
      aria-labelledby="how-it-works-title"
      className={styles.section}
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 id="how-it-works-title" className={styles.title}>
            Empieza en tres pasos
          </h2>
          <p className={styles.description}>
            De cero a tu primer tablero en menos de un minuto, sin configuraciones
            complicadas.
          </p>
        </div>

        <ol className={styles.grid}>
          {STEPS.map((step) => (
            <li key={step.step} className={styles.card}>
              <span aria-hidden="true" className={styles.stepNumber}>
                {step.step}
              </span>
              <span aria-hidden="true" className={styles.stepIcon}>
                <step.icon className="icon-lg" />
              </span>
              <div className={styles.stepBody}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
