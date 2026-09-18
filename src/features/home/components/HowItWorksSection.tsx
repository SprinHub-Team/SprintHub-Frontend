const steps = [
    {
        number: '01',
        title: 'Crea tu grupo',
        description:
            'Forma un espacio de trabajo para reunir a las personas que participan en tu proyecto.',
    },
    {
        number: '02',
        title: 'Crea tu tablero',
        description:
            'Define un tablero que represente el proyecto o flujo de trabajo que quieres gestionar.',
    },
    {
        number: '03',
        title: 'Organiza las tareas',
        description:
            'Utiliza columnas y tarjetas para representar las diferentes etapas y actividades.',
    },
    {
        number: '04',
        title: 'Colabora',
        description:
            'Mantén la comunicación y el seguimiento del trabajo directamente dentro del proyecto.',
    },
] as const;

function HowItWorksSection() {
    return (
        <section className="bg-(--bg) py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl">
                    <span className="text-sm font-semibold uppercase tracking-wider text-(--accent)">
                        Cómo funciona
                    </span>

                    <h2 className="mt-3 text-3xl font-bold tracking-tight text-(--text) sm:text-4xl">
                        De la idea al trabajo organizado
                    </h2>

                    <p className="mt-4 text-(--text-light)">
                        Una estructura sencilla para comenzar a gestionar tus
                        proyectos.
                    </p>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    
                    {steps.map((step) => (
                        <article key={step.number} className="relative">
                            <span className="text-sm font-bold text-(--secondary)">
                                {step.number}
                            </span>

                            <h3 className="mt-3 text-lg font-semibold text-(--text)">
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