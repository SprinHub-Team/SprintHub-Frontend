import { Link } from 'react-router-dom';

function HeroSection() {
    return (
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-(image:--gradient-main) opacity-[0.08]" />

        <div className="relative mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <span className="mb-5 inline-flex rounded-(--radius-sm) border border-(--border) bg-(--surface) px-3 py-1.5 text-sm font-medium text-(--secondary)">
              Gestión de proyectos colaborativa
            </span>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-(--text) sm:text-5xl lg:text-6xl">
              Organiza tu trabajo.
              <span className="block bg-(image:--gradient-main) bg-clip-text text-transparent">
                Impulsa tu equipo.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-(--text-light) sm:text-lg">
              SprintHub te permite organizar proyectos, administrar tareas y
              colaborar con tu equipo desde un solo lugar.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-(--radius-sm) bg-(image:--gradient-main) px-4 py-2.5 font-medium text-(--on-gradient) transition-[filter,box-shadow] duration-200 ease-out hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-(--secondary) focus:ring-offset-2 focus:ring-offset-(--bg)"
              >
                Comenzar ahora
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-(--radius-sm) px-4 py-2.5 font-medium text-(--text) transition-colors duration-200 hover:bg-(--surface-2) focus:outline-none focus:ring-2 focus:ring-(--secondary) focus:ring-offset-2 focus:ring-offset-(--bg)"
              >
                Iniciar sesión
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-4 rounded-[calc(var(--radius)+8px)] bg-(image:--gradient-main) opacity-20 blur-3xl" />

            <div className="relative overflow-hidden rounded-(--radius) border border-(--border) bg-(--surface) shadow-(--shadow)">
              <div className="grid gap-4 p-5 sm:grid-cols-3">
                {["Pendiente", "En progreso", "Completado"].map(
                  (column, columnIndex) => (
                    <div
                      key={column}
                      className="rounded-(--radius-sm) bg-(--bg-secondary) p-3"
                    >
                      <h3 className="mb-3 text-sm font-semibold text-(--text)">
                        {column}
                      </h3>

                      {[1, 2].map((card) => (
                        <div
                          key={card}
                          className="mb-3 rounded-(--radius-sm) border border-(--border) bg-(--surface) p-3 last:mb-0"
                        >
                          <div className="mb-3 h-2 w-3/4 rounded-full bg-(--border-strong)" />

                          <div className="flex items-center justify-between">
                            <span className="h-2 w-1/2 rounded-full bg-(--border)" />

                            {columnIndex === 2 && (
                              <span className="h-2 w-2 rounded-full bg-(--success)" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}

export default HeroSection;