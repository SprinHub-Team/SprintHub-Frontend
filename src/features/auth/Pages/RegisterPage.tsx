import {Link, useNavigate} from 'react-router-dom';
import AuthFormLayout from '../components/AuthFormLayout';
import {registerSchema, type RegisterFormData} from '../types/auth.schema';
import { ApiError } from '@/services/api/errors/ApiError';
import { useState } from 'react';
import { useRegister } from '../hooks/useRegister';
import Input from '@/components/common/ui/Input';
import Alert from '@/components/common/ui/Alert';
import Button from '@/components/common/ui/Button';

function RegisterPage() {
    
    const navigate = useNavigate();

    const {executeRegister, isLoading} = useRegister();

    const [formData, setFormData] = useState<RegisterFormData>({
            name: '',
            email: '',
            documentId: '',
            password: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});

    const [generalError, setGeneralError] = useState<string | null>(null);

    function handleChange(field: keyof RegisterFormData, value: string) {

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

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {

        event.preventDefault();

        setErrors({});
        setGeneralError(null);

        const validation = registerSchema.safeParse(formData);

        if (!validation.success) {
            
            const fieldErrors: Partial<Record<keyof RegisterFormData, string>> = {};

            for (const issue of validation.error.issues) {
                
                const field = issue.path[0];

                if (typeof field === 'string' && field in formData) {

                    fieldErrors[field as keyof RegisterFormData] = issue.message;

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

            setGeneralError('No fue posible crear la cuenta.');

        }
    }

    return (
        <AuthFormLayout
            title="Crear cuenta"
            description="Regístrate para comenzar a utilizar SprintHub."
            footer={
                <>
                    ¿Ya tienes una cuenta?{' '}
                    <Link
                        to="/login"
                        className="font-medium text-[var(--secondary)] hover:underline"
                    >
                        Iniciar sesión
                    </Link>
                </>
            }
        >
            <div className="space-y-5">
                {generalError && (
                    <Alert variant="danger">
                        {generalError}
                    </Alert>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    noValidate
                >
                    <Input
                        id="name"
                        type="text"
                        label="Nombre"
                        placeholder="Tu nombre"
                        value={formData.name}
                        onChange={event =>
                            handleChange(
                                'name',
                                event.target.value,
                            )
                        }
                        error={errors.name}
                        disabled={isLoading}
                    />

                    <Input
                        id="email"
                        type="email"
                        label="Correo electrónico"
                        placeholder="correo@ejemplo.com"
                        value={formData.email}
                        onChange={event =>
                            handleChange(
                                'email',
                                event.target.value,
                            )
                        }
                        error={errors.email}
                        disabled={isLoading}
                    />

                    <Input
                        id="documentId"
                        type="text"
                        label="Documento"
                        placeholder="Número de documento"
                        value={formData.documentId}
                        onChange={event =>
                            handleChange(
                                'documentId',
                                event.target.value,
                            )
                        }
                        error={errors.documentId}
                        disabled={isLoading}
                    />

                    <Input
                        id="password"
                        type="password"
                        label="Contraseña"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={event =>
                            handleChange(
                                'password',
                                event.target.value,
                            )
                        }
                        error={errors.password}
                        disabled={isLoading}
                    />

                    <Button
                        type="submit"
                        className="w-full"
                        isLoading={isLoading}
                    >
                        Crear cuenta
                    </Button>
                </form>
            </div>
        </AuthFormLayout>
    );
}

export default RegisterPage;