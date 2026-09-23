const steps = [
    {
        number: '01',
        title: 'Crea tu grupo',
        description:
            'Organiza a las personas que participarán en el proyecto.',
    },
    {
        number: '02',
        title: 'Construye tu tablero',
        description:
            'Define las columnas y estructura que utilizará tu equipo.',
    },
    {
        number: '03',
        title: 'Gestiona las tareas',
        description:
            'Crea tarjetas y mueve el trabajo según su progreso.',
    },
    {
        number: '04',
        title: 'Colabora',
        description:
            'Comparte información y utiliza comentarios para mantener al equipo coordinado.',
    },
];

function HowItWorksSection() {
    return (
        <section className="bg-(--bg) py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <header className="max-w-2xl">
                    <span className="text-sm font-semibold uppercase tracking-wider text-(--info)">
                        Cómo funciona
                    </span>

                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-(--text) sm:text-4xl">
                        De la planificación al seguimiento
                    </h2>

                    <p className="mt-4 text-(--text-light)">
                        Una estructura sencilla para mantener organizado el
                        trabajo de tu equipo.
                    </p>
                </header>

                <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step) => (
                        <article key={step.number} className="relative">
                            <span className="text-sm font-bold text-(--secondary)">
                                {step.number}
                            </span>

                            <h3 className="mt-4 text-lg font-semibold text-(--text)">
                                {step.title}
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-(--text-light)">
                                {step.description}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HowItWorksSection;