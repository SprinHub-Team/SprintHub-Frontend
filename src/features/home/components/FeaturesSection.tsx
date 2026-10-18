import {
  Flag,
  KanbanSquare,
  MonitorSmartphone,
  UserCheck,
  Users,
  Zap,
} from 'lucide-react';
import styles from './FeaturesSection.module.css';

const FEATURES = [
  {
    icon: Zap,
    title: 'Sincronización en tiempo real',
    description:
      'Cada columna y tarjeta se refleja al instante en las pantallas de todo el equipo gracias a la capa realtime.',
  },
  {
    icon: Users,
    title: 'Espacios de trabajo con roles',
    description:
      'Organiza tus grupos de trabajo con administradores y colaboradores, e invita a nuevos miembros por correo.',
  },
  {
    icon: KanbanSquare,
    title: 'Tableros listos para usar',
    description:
      'Cada tablero nuevo llega con las columnas Por hacer, En proceso y Hecho, preparadas para trabajar de inmediato.',
  },
  {
    icon: UserCheck,
    title: 'Responsables por tarjeta',
    description:
      'Asigna cada tarjeta a un miembro del grupo para que quede claro quién avanza cada tarea del tablero.',
  },
  {
    icon: Flag,
    title: 'Prioridades claras',
    description:
      'Marca tarjetas con prioridad alta, media o baja para que el equipo sepa qué atender primero.',
  },
  {
    icon: MonitorSmartphone,
    title: 'Accesible y responsive',
    description:
      'Interfaz cuidada para teclado y lectores de pantalla, con diseño adaptado a móvil, tablet y escritorio.',
  },
] as const;

export function FeaturesSection() {
  return (
    <section aria-labelledby="features-title" className={styles.section}>
      <div className={styles.header}>
        <h2 id="features-title" className={styles.title}>
          Todo lo que tu equipo necesita
        </h2>
        <p className={styles.description}>
          SprintHub está construido para el día a día de los equipos ágiles: desde
          la planificación del sprint hasta el seguimiento de cada detalle.
        </p>
      </div>

      <ul className={styles.grid}>
        {FEATURES.map((feature) => (
          <li key={feature.title} className={styles.card}>
            <span aria-hidden="true" className={styles.cardIcon}>
              <feature.icon className="icon-lg" />
            </span>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
