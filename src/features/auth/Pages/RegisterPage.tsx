import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ApiError } from '@/services/api/errors/ApiError';
import { useRegister } from '../hooks/useRegister';
import {
    registerSchema,
    type RegisterFormData,
} from '../types/auth.schema';

function RegisterPage() {
    const navigate = useNavigate();
    const { executeRegister, isLoading } = useRegister();

    const [formData, setFormData] =
        useState<RegisterFormData>({
            name: '',
            email: '',
            documentId: '',
            password: '',
        });

    const [errors, setErrors] = useState<
        Partial<Record<keyof RegisterFormData, string>>
    >({});

    const [generalError, setGeneralError] =
        useState<string | null>(null);

    function handleChange(
        field: keyof RegisterFormData,
        value: string,
    ) {
        setFormData(previous => ({
            ...previous,
            [field]: value,
        }));

        setErrors(previous => ({
            ...previous,
            [field]: undefined,
        }));

        setGeneralError(null);
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        setErrors({});
        setGeneralError(null);

        const validation = registerSchema.safeParse(formData);

        if (!validation.success) {
            const fieldErrors: Partial<
                Record<keyof RegisterFormData, string>
            > = {};

            for (const issue of validation.error.issues) {
                const field = issue.path[0];

                if (
                    typeof field === 'string' &&
                    field in formData
                ) {
                    fieldErrors[
                        field as keyof RegisterFormData
                    ] = issue.message;
                }
            }

            setErrors(fieldErrors);
            return;
        }

        try {
            await executeRegister(validation.data);

            navigate('/login', {
                replace: true,
                state: {
                    message:
                        'Cuenta creada correctamente. Ahora puedes iniciar sesión.',
                },
            });
        } catch (error: unknown) {
            if (error instanceof ApiError) {
                setGeneralError(error.message);
                return;
            }

            setGeneralError(
                'No fue posible crear la cuenta.',
            );
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-8">
            <section className="w-full max-w-md rounded-lg bg-white p-8 shadow">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Crear cuenta
                    </h1>

                    <p className="mt-2 text-sm text-gray-600">
                        Regístrate para comenzar a utilizar SprintHub.
                    </p>
                </div>

                {generalError && (
                    <div
                        role="alert"
                        className="mb-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                    >
                        {generalError}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    noValidate
                >
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Nombre
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={event =>
                                handleChange(
                                    'name',
                                    event.target.value,
                                )
                            }
                            disabled={isLoading}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
                        />

                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Correo electrónico
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={event =>
                                handleChange(
                                    'email',
                                    event.target.value,
                                )
                            }
                            disabled={isLoading}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
                        />

                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="documentId"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Documento
                        </label>

                        <input
                            id="documentId"
                            type="text"
                            value={formData.documentId}
                            onChange={event =>
                                handleChange(
                                    'documentId',
                                    event.target.value,
                                )
                            }
                            disabled={isLoading}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
                        />

                        {errors.documentId && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.documentId}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1 block text-sm font-medium text-gray-700"
                        >
                            Contraseña
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={event =>
                                handleChange(
                                    'password',
                                    event.target.value,
                                )
                            }
                            disabled={isLoading}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500"
                        />

                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-md bg-gray-900 px-4 py-2 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading
                            ? 'Creando cuenta...'
                            : 'Crear cuenta'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    ¿Ya tienes una cuenta?{' '}
                    <Link
                        to="/login"
                        className="font-medium text-gray-900 underline"
                    >
                    Iniciar sesión
                    </Link>
                </p>
            </section>
        </main>
    );
}

export default RegisterPage;