import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { APP_ROUTES, navigateTo } from '@/app/router/routes';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

export function HomeCtaSection() {
  const status = useAuthStore((state) => state.status);
  const isAuthenticated = status === 'authenticated';

  return (
    <section aria-labelledby="cta-title" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20">
      <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-(--radius) border border-(--border-light) bg-(image:--gradient-main) px-6 py-14 text-center shadow-(--shadow) sm:px-12">
        <h2
          id="cta-title"
          className="max-w-2xl text-3xl font-semibold tracking-tight text-(--brown) sm:text-4xl"
        >
          Tu próximo proyecto empieza hoy
        </h2>
        <p className="max-w-xl text-base leading-relaxed text-(--brown)/80">
          Crea tu cuenta, arma tu grupo de trabajo y descubre lo fluido que puede
          ser colaborar cuando todo el equipo trabaja en armonia.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          {isAuthenticated ? (
            <Button
              size="lg"
              variant="secondary"
              className="border-(--brown) bg-(--brown) text-(--paper) hover:border-(--brown) hover:bg-(--brown)/90"
              icon={<ArrowRight aria-hidden="true" className="size-4" />}
              onClick={() => navigateTo(APP_ROUTES.dashboard)}
            >
              Ir al dashboard
            </Button>
          ) : (
            <>
              <Button
                size="lg"
                variant="secondary"
                className="border-(--brown) bg-(--brown) text-(--paper) hover:border-(--brown) hover:bg-(--brown)/90"
                icon={<ArrowRight aria-hidden="true" className="size-4" />}
                onClick={() => navigateTo(APP_ROUTES.register)}
              >
                Crear cuenta gratis
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-(--brown) hover:bg-(--brown)/10 hover:text-(--brown)"
                onClick={() => navigateTo(APP_ROUTES.login)}
              >
                Ya tengo cuenta
              </Button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
