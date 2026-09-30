import { KanbanSquare, Radio, Users } from 'lucide-react';

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
      'Elige una plantilla Kanban, Scrum o de errores y comienza con las columnas listas.',
  },
  {
    icon: Radio,
    step: '3',
    title: 'Colabora en tiempo real',
    description:
      'Mueve tarjetas, ajusta prioridades y comenta: todos verán los cambios al instante.',
  },
] as const;

export function HowItWorksSection() {
  return (
    <section
      aria-labelledby="how-it-works-title"
      className="border-y border-(--border-subtle) bg-(--ink-raised)"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <div className="mb-10 flex max-w-2xl flex-col gap-3">
          <h2
            id="how-it-works-title"
            className="text-3xl font-semibold tracking-tight text-(--text-on-dark)"
          >
            Empieza en tres pasos
          </h2>
          <p className="text-base leading-relaxed text-(--text-muted)">
            De cero a tu primer tablero en menos de un minuto, sin configuraciones
            complicadas.
          </p>
        </div>

        <ol className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-6">
          {STEPS.map((step) => (
            <li
              key={step.step}
              className="relative flex flex-col gap-4 rounded-(--radius) border border-(--border-subtle) bg-(--ink) p-6"
            >
              <span
                aria-hidden="true"
                className="absolute top-6 right-6 text-4xl font-bold text-(--taupe)/40"
              >
                {step.step}
              </span>
              <span
                aria-hidden="true"
                className="flex size-11 items-center justify-center rounded-(--radius-sm) border border-(--border-dark) bg-(--ink-soft) text-(--sand)"
              >
                <step.icon className="size-5" />
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-(--text-on-dark)">{step.title}</h3>
                <p className="text-sm leading-relaxed text-(--text-muted)">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
