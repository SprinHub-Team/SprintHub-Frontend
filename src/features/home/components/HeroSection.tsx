import { ArrowRight, KanbanSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { APP_ROUTES, navigateTo } from '@/app/router/routes';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

export function HeroSection() {
  const status = useAuthStore((state) => state.status);
  const isAuthenticated = status === 'authenticated';

  return (
    <section className="relative overflow-hidden border-b border-(--border-subtle)">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-(image:--gradient-ink)"
      />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-(--border-subtle) bg-(--ink-raised) px-4 py-1.5 text-xs font-medium text-(--cream)">
            <KanbanSquare aria-hidden="true" className="size-3.5 text-(--sand)" />
            Tableros ágiles en tiempo real
          </span>

          <h1 className="text-4xl leading-tight font-semibold tracking-tight text-(--text-on-dark) sm:text-5xl">
            Organiza tus sprints con{' '}
            <span className="bg-(image:--gradient-main) bg-clip-text text-transparent">
              claridad total
            </span>
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-(--text-muted) sm:text-lg">
            SprintHub reúne tus espacios de trabajo en un solo lugar. Colabora con tu equipo al instante, con
            roles claros y plantillas listas para Kanban, Scrum o seguimiento de
            errores.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            {isAuthenticated ? (
              <Button
                size="lg"
                icon={<ArrowRight aria-hidden="true" className="size-4" />}
                onClick={() => navigateTo(APP_ROUTES.dashboard)}
              >
                Ir al dashboard
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  onClick={() => navigateTo(APP_ROUTES.register)}
                  icon={<ArrowRight aria-hidden="true" className="size-4" />}
                >
                  Crear cuenta gratis
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigateTo(APP_ROUTES.login)}
                >
                  Iniciar sesión
                </Button>
              </>
            )}
          </div>
        </div>

        <BoardMockup />
      </div>
    </section>
  );
}

function BoardMockup() {
  return (
    <div
      aria-hidden="true"
      className="hidden w-full rounded-(--radius) border border-(--border-subtle) bg-(--ink-raised) p-4 shadow-(--shadow) lg:block"
    >
      <div className="mb-4 flex items-center gap-3 border-b border-(--border-subtle) pb-3">
        <span className="flex size-8 items-center justify-center rounded-(--radius-sm) bg-(image:--gradient-main) text-(--brown)">
          <KanbanSquare className="size-4" />
        </span>
        <div className="flex flex-col gap-1">
          <span className="h-2.5 w-32 rounded-full bg-(--sand)" />
          <span className="h-2 w-20 rounded-full bg-(--taupe)/60" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { title: 'Por hacer', cards: ['Diseño de API', 'Modelo de datos'], tone: 'bg-(--taupe)' },
          { title: 'En proceso', cards: ['Autenticación JWT'], tone: 'bg-(--sand)' },
          { title: 'Hecho', cards: ['Contratos Zod', 'CI/CD'], tone: 'bg-(--cream)' },
        ].map((column) => (
          <div
            key={column.title}
            className="flex flex-col gap-2.5 rounded-(--radius-sm) border border-(--border-subtle) bg-(--ink-soft) p-3"
          >
            <div className="flex items-center gap-2">
              <span className={`size-2 rounded-full ${column.tone}`} />
              <span className="text-xs font-medium text-(--text-on-dark)">{column.title}</span>
            </div>
            {column.cards.map((card) => (
              <div
                key={card}
                className="rounded-(--radius-sm) border border-(--border-subtle) bg-(--ink-raised) px-3 py-2.5"
              >
                <span className="block h-2 w-full rounded-full bg-(--taupe)/50" />
                <span className="mt-1.5 block h-2 w-2/3 rounded-full bg-(--taupe)/30" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
