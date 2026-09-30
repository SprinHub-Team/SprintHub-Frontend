import { KanbanSquare, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { APP_ROUTES, navigateTo } from '@/app/router/routes';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { HeroSection } from '../components/HeroSection';
import { FeaturesSection } from '../components/FeaturesSection';
import { HowItWorksSection } from '../components/HowItWorksSection';
import { HomeCtaSection } from '../components/HomeCtaSection';

export function HomePage() {
  const status = useAuthStore((state) => state.status);
  const isAuthenticated = status === 'authenticated';

  return (
    <div className="flex min-h-screen flex-col bg-(--ink)">
      <header className="sticky top-0 z-40 border-b border-(--border-subtle) bg-(--ink)/90 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <button
            type="button"
            onClick={() => navigateTo(APP_ROUTES.home)}
            className="flex items-center gap-2.5 rounded-(--radius-sm) px-1 py-1"
            aria-label="SprintHub — ir al inicio"
          >
            <span
              aria-hidden="true"
              className="flex size-9 items-center justify-center rounded-(--radius-sm) border border-(--border-light) bg-(image:--gradient-main) text-(--brown)"
            >
              <KanbanSquare className="size-5" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-(--text-on-dark)">
              SprintHub
            </span>
          </button>

          <nav aria-label="Navegación principal" className="flex items-center gap-2">
            {isAuthenticated ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigateTo(APP_ROUTES.dashboard)}
              >
                Ir al dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={<LogIn aria-hidden="true" className="size-4" />}
                  onClick={() => navigateTo(APP_ROUTES.login)}
                >
                  Iniciar sesión
                </Button>
                <Button
                  size="sm"
                  icon={<UserPlus aria-hidden="true" className="size-4" />}
                  onClick={() => navigateTo(APP_ROUTES.register)}
                >
                  Crear cuenta
                </Button>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <HomeCtaSection />
      </main>

      <footer className="border-t border-(--border-subtle) bg-(--ink-raised)">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-2 px-4 py-6 text-center sm:px-6">
          <p className="text-sm text-(--text-muted)">
            SprintHub — Tableros ágiles en tiempo real para equipos que entregan.
          </p>
        </div>
      </footer>
    </div>
  );
}
