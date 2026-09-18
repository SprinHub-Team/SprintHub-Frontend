import ButtonLink from "@/components/common/ui/ButtonLink";

function HeroSection(){
    return (
      <section className="relative overflow-hidden border-b border-(--border) bg-(--bg)">
        <div className="absoute inset-0 bg-(image:--gradient-main) opacity-10" />

        <div className="relative mx-auto grid max-w-7xL items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <span className="mb-5 inline-flex rounded-full border-(--success-border) bg-(--success-bg) px-3 py-1 text-sm font-medium text-(--success)">
              Gestión de proyectos y colaboración
            </span>

            <h1 className="text-4xl font-bold tracking-tight text-(--text) sm:text-5xl lg:text-6xl">
              Organiza tus proyectos.
              <span className="block bg-(image:--gradient-main) bg-clip-text text-transparent">
                Trabaja en equipo.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-(--text-light) sm:text-lg">
              SprintHub te permite organizar proyectos, gestionar tareas y
              colaborar con tu equipo desde un mismo espacio de trabajo.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              
              <ButtonLink to="/register">Crear cuenta</ButtonLink>

              <ButtonLink to="/login" variant="ghost">
                Iniciar sesión
              </ButtonLink>

            </div>
          </div>

          <div className="relative">
            <div className="rounded-(--radius) border border-(--border) bg-(--surface) p-4 shadow-(--shadow)">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="h-3 w-28 rounded-full bg-(--border-strong)" />
                  <div className="mt-2 h-2 w-20 rounded-full bg-(--border)" />
                </div>

              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-(--radius-sm) bg-(--surface-2) p-3">
                  <div className="mb-3 h-2 w-16 rounded-full bg-(--border-strong)" />

                  <div className="space-y-2">
                    <div className="h-16 rounded-lg border border-(--border) bg-(--surface)" />
                    <div className="h-12 rounded-lg border border-(--border) bg-(--surface)" />
                  </div>
                </div>

                <div className="rounded-(--radius-sm) bg-(--surface-2) p-3">
                  <div className="mb-3 h-2 w-20 rounded-full bg-(--secondary)" />

                  <div className="space-y-2">
                    <div className="h-20 rounded-lg border border-(--border) bg-(--surface)" />
                    <div className="h-14 rounded-lg border border-(--border) bg-(--surface)" />
                  </div>
                </div>

                <div className="rounded-(--radius-sm) bg-(--surface-2) p-3">
                  <div className="mb-3 h-2 w-14 rounded-full bg-(--accent)" />

                  <div className="space-y-2">
                    <div className="h-14 rounded-lg border border-(--border) bg-(--surface)" />
                    <div className="h-20 rounded-lg border border-(--border) bg-(--surface)" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}

export default HeroSection;