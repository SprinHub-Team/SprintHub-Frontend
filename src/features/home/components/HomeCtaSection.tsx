import { Link } from 'react-router-dom';

function HomeCtaSection() {
    return (
        <section className="border-t border-(--border) bg-(--bg-secondary) py-20">
            <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                <div className="rounded-(--radius) border border-(--border) bg-(--surface) p-8 shadow-(--shadow) sm:p-12">
                    <h2 className="text-3xl font-bold tracking-tight text-(--text) sm:text-4xl">
                        Empieza a organizar tus proyectos
                    </h2>

                    <p className="mx-auto mt-4 max-w-xl text-(--text-light)">
                        Crea tu cuenta y comienza a trabajar con tu equipo en
                        SprintHub.
                    </p>

                    <Link
                        to="/register"
                        className="mt-8 inline-flex items-center justify-center rounded-(--radius-sm) bg-(image:--gradient-main) px-6 py-3 font-semibold text-(--on-gradient) transition-[filter,box-shadow] duration-200 hover:brightness-110 hover:shadow-(--glow) focus:outline-none focus:ring-2 focus:ring-(--secondary) focus:ring-offset-2 focus:ring-offset-(--surface)"
                    >
                        Crear cuenta
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default HomeCtaSection;