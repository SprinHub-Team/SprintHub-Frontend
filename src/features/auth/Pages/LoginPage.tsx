import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { loginSchema, type LoginFormData } from "../types/auth.schema";
import { useState } from "react";
import { ApiError } from "@/services/api/errors/ApiError";
import AuthFormLayout from "../components/AuthFormLayout";
import Alert from "@/components/common/ui/Alert";
import Input from "@/components/common/ui/Input";
import Button from "@/components/common/ui/Button";


function LoginPage(){

    const navigate = useNavigate();
    const location = useLocation();

    const { executeLogin, isLoading } = useLogin();

    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password:''
    });

    const [errors, setErrors] = useState<
        Partial<Record<keyof LoginFormData, string>>
    >({});

    const[generalError, setGeneralError]= useState<string | null>(null);

    const registrationMessage = typeof location.state?.message === 'string' ? location.state.message : null;

    function handleChange(field: keyof LoginFormData, value: string){
        
        setFormData(previous => ({
            ...previous, [field]: value
        }));

        setErrors(previous =>({
            ...previous, [field]: undefined
        }));

        setGeneralError(null);

    }

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>){

        event.preventDefault();

        setErrors({});
        setGeneralError(null);

        const validation = loginSchema.safeParse(formData);

        if(!validation.success){

            const fieldErrors: Partial<Record<keyof LoginFormData, string>>={};

            for(const issue of validation.error.issues){
                const field = issue.path[0];

                if(typeof field === 'string' && field in formData){

                    fieldErrors[field as keyof LoginFormData] = issue.message;

                }

            }

            setErrors(fieldErrors);
            return;
        }

        try{

            await executeLogin(validation.data);

            const from = location.state?.from;

            if(from && typeof from.pathname === 'string'){

                navigate(`${from.pathname}${from.search ?? ''}${from.hash ?? ''}`,
                {replace: true});

                return;
            }

            navigate('/dashboard', {replace: true});

        }catch(error: unknown){

            if(error instanceof ApiError){

                setGeneralError(error.message);
                return;
            }

            setGeneralError('No fue posible iniciar sesion.');

        }
    }

    return (
        <AuthFormLayout
            title="Iniciar sesión"
            description="Ingresa a tu cuenta de SprintHub."
            footer={
                <>
                  ¿No tienes una cuenta?{' '}
                    <Link
                        to="/register"
                        className="font-medium text text-[var(--secondary)] hover:underline">
                            Registrarse
                    </Link>
                </>
            }
            >
                <div className="space-y-5">
                    {registrationMessage &&(
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
                            id="email"
                            type="email"
                            label="Correo electrónico"
                            placeholder="correo@ejemplo.com"
                            value={formData.email}
                            onChange={event =>
                                handleChange(
                                    'email',
                                    event.target.value
                                )
                            }
                            error={errors.email}
                            disabled={isLoading}
                        />

                        <Input
                            id="password"
                            type="password"
                            label="Contraseña"
                            placeholder="*********"
                            value={formData.password}
                            onChange={event =>
                                handleChange(
                                    'password',
                                    event.target.value
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
                            Iniciar sesión
                        </Button>
                    </form>
                </div>
        </AuthFormLayout>
    );
}

export default LoginPage;