const features = [
    {
        title: 'Organiza tus proyectos',
        description:
            'Crea tableros y estructuras de trabajo para mantener tus proyectos organizados.',
        icon: '01',
    },
    {
        title: 'Gestiona tus tareas',
        description:
            'Distribuye el trabajo mediante columnas y tarjetas para conocer el estado de cada tarea.',
        icon: '02',
    },
    {
        title: 'Colabora con tu equipo',
        description:
            'Trabaja junto a los integrantes de tu grupo y mantén la información centralizada.',
        icon: '03',
    },
    {
        title: 'Mantén el seguimiento',
        description:
            'Utiliza comentarios y estados para mantener el contexto de cada actividad.',
        icon: '04',
    },
] as const;

function FeaturesSection() {
    return (
        <section className="bg-(--bg-secondary) py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <span className="text-sm font-semibold uppercase tracking-wider text-(--secondary)">
                        Funcionalidades
                    </span>

                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-(--text) sm:text-4xl">
                        Todo lo necesario para gestionar tu trabajo
                    </h2>

                    <p className="mt-4 text-(--text-light)">
                        SprintHub centraliza la organización y colaboración de
                        tus proyectos en un único espacio.
                    </p>
                </div>

                <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    {features.map((feature) => (
                        <article
                            key={feature.title}
                            className="rounded-(--radius) border border-(--border) bg-(--surface) p-6 transition-[transform,box-shadow,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-(--border-strong) hover:shadow-(--shadow-hover)"
                        >
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-(--radius-sm) bg-(--surface-2) text-sm font-bold text-(--secondary)">
                                {feature.icon}
                            </span>

                            <h3 className="mt-5 text-lg font-semibold text-(--text)">
                                {feature.title}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-(--text-light)">
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