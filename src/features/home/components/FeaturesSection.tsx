import {
  Flag,
  LayoutTemplate,
  MessageSquare,
  MonitorSmartphone,
  Users,
  Zap,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Zap,
    title: 'Sincronización en tiempo real',
    description:
      'Cada columna, tarjeta y comentario se refleja al instante en las pantallas de todo el equipo gracias a la capa realtime.',
  },
  {
    icon: Users,
    title: 'Espacios de trabajo con roles',
    description:
      'Organiza tus grupos de trabajo con administradores y colaboradores, e invita a nuevos miembros por correo.',
  },
  {
    icon: LayoutTemplate,
    title: 'Plantillas listas para usar',
    description:
      'Crea tableros Kanban, Scrum o de seguimiento de errores con sus columnas preparadas desde el primer momento.',
  },
  {
    icon: MessageSquare,
    title: 'Comentarios contextuales',
    description:
      'Conversa dentro de cada tarjeta: el historial de comentarios acompaña a la tarea en cualquier columna.',
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
    <section aria-labelledby="features-title" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20">
      <div className="mb-10 flex max-w-2xl flex-col gap-3">
        <h2
          id="features-title"
          className="text-3xl font-semibold tracking-tight text-(--text-on-dark)"
        >
          Todo lo que tu equipo necesita
        </h2>
        <p className="text-base leading-relaxed text-(--text-muted)">
          SprintHub está construido para el día a día de los equipos ágiles: desde
          la planificación del sprint hasta el seguimiento de cada detalle.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {FEATURES.map((feature) => (
          <li
            key={feature.title}
            className="flex flex-col gap-4 rounded-(--radius) border border-(--border-subtle) bg-(--ink-raised) p-6 transition-[box-shadow,border-color] duration-200 ease-out hover:border-(--border-dark) hover:shadow-(--shadow)"
          >
            <span
              aria-hidden="true"
              className="flex size-11 items-center justify-center rounded-(--radius-sm) border border-(--border-light) bg-(image:--gradient-main) text-(--brown)"
            >
              <feature.icon className="size-5" />
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-(--text-on-dark)">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-(--text-muted)">{feature.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
