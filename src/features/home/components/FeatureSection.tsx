const features = [
    {
        title: 'Tableros organizados',
        description:
            'Visualiza el trabajo de tu equipo mediante tableros y columnas que representan cada etapa del proyecto.',
        icon: '▦',
    },
    {
        title: 'Gestión de tareas',
        description:
            'Crea y administra tarjetas para mantener cada tarea organizada y con el contexto necesario.',
        icon: '✓',
    },
    {
        title: 'Trabajo colaborativo',
        description:
            'Trabaja con los miembros de tu grupo y mantén la información del proyecto centralizada.',
        icon: '◎',
    },
    {
        title: 'Seguimiento',
        description:
            'Utiliza comentarios y estados para mantener el progreso visible durante todo el proyecto.',
        icon: '↗',
    },
];

function FeaturesSection() {
    return (
        <section className="border-t border-(--border) bg-(--bg-secondary) py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <header className="mx-auto max-w-2xl text-center">
                    <span className="text-sm font-semibold uppercase tracking-wider text-(--secondary)">
                        Funcionalidades
                    </span>

                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-(--text) sm:text-4xl">
                        Todo lo necesario para organizar tus proyectos
                    </h2>

                    <p className="mt-4 text-(--text-light)">
                        SprintHub reúne las herramientas principales para
                        planificar, organizar y dar seguimiento al trabajo.
                    </p>
                </header>

                <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature) => (
                        <article
                            key={feature.title}
                            className="rounded-(--radius) border border-(--border) bg-(--surface) p-6 transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-(--border-strong) hover:shadow-(--shadow-hover)"
                        >
                            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-(--radius-sm) bg-(--surface-2) text-xl text-(--secondary)">
                                {feature.icon}
                            </div>

                            <h3 className="text-lg font-semibold text-(--text)">
                                {feature.title}
                            </h3>

                            <p className="mt-3 text-sm leading-6 text-(--text-light)">
                                {feature.description}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FeaturesSection;
