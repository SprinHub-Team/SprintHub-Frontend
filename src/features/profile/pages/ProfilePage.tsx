import { ArrowLeft, KanbanSquare } from 'lucide-react';
import { APP_ROUTES, navigateTo } from '@/app/router/routes';
import { ProfileView } from '../components/ProfileView';

export function ProfilePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-(--ink)">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-(--border-subtle) bg-(--ink-raised) px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => navigateTo(APP_ROUTES.dashboard)}
          aria-label="Volver al dashboard"
          className="flex items-center gap-2 rounded-(--radius-sm) p-2 text-(--text-muted) transition-colors duration-200 ease-out hover:bg-(--ink-soft) hover:text-(--text-on-dark)"
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
          <span className="hidden text-sm font-medium sm:inline">Volver</span>
        </button>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2.5">
          <span
            aria-hidden="true"
            className="flex size-7 items-center justify-center rounded-(--radius-sm) border border-(--border-light) bg-(image:--gradient-main) text-(--brown)"
          >
            <KanbanSquare className="size-4" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-(--text-on-dark)">
            Mi perfil
          </span>
        </div>
        <span aria-hidden="true" className="w-9 shrink-0" />
      </header>

      <main className="flex flex-1 justify-center px-4 py-6 sm:px-6" aria-label="Perfil del usuario">
        <ProfileView />
      </main>
    </div>
  );
}
