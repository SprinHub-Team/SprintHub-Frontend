import ButtonLink from '@/components/common/ui/ButtonLink';

function HomeCtaSection() {
    return (
        <section className="bg-(--bg-secondary) px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl overflow-hidden rounded-(--radius) border border-(--border) bg-(--surface) shadow-(--shadow)">
                <div className="relative px-6 py-14 text-center sm:px-12">
                    <div className="absolute inset-0 bg-(image:--gradient-main) opacity-10" />

                    <div className="relative">
                        <span className="text-sm font-semibold uppercase tracking-wider text-(--secondary)">
                            Empieza ahora
                        </span>

                        <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight text-(--text) sm:text-4xl">
                            Lleva tus proyectos a un espacio de trabajo
                            organizado
                        </h2>

                        <p className="mx-auto mt-4 max-w-xl text-(--text-light)">
                            Crea tu cuenta y comienza a organizar tus proyectos
                            y tareas con SprintHub.
                        </p>

                        <div className="mt-8">
                            <ButtonLink to="/register">
                                Crear cuenta
                            </ButtonLink>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default HomeCtaSection;