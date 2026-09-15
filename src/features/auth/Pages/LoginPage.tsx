import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { loginSchema, type LoginFormData } from "../types/auth.schema";
import { useState } from "react";
import { ApiError } from "@/services/api/errors/ApiError";


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

    function handleChange(field: keyof LoginFormData, value: string){
        
        setFormData(previous=> ({
            ...previous, [field]: value
        }));

        setErrors(previous=>({
            ...previous, [field]: undefined
        }));

        setGeneralError(null);

    }

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>){

        event.preventDefault();

        setGeneralError(null);
        setErrors({});

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
      <main className="flex min-h-screen items-center justify-center b-gray-100 px-4">
        <section className="w-full max-w-md rounded-lg bg-white p-8 shadow">
          <div className="mb-8">
            <h1 className="text-2x1 font-bold text-gray-900">
                Iniciar sesión
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Ingresa a tu cuenta de SprintHub.
            </p>
          </div>

           {generalError &&(
            <div
             role="alert"
             className="mb-5 rounded-mb border border-red-200 bg-red-50 p-3 text-red-700">
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
                     htmlFor="email"
                     className="mb-1 block text-sm font-medium text-gray-700">
                        Correo Electronico
                    </label>

                    <input
                     id="email"
                     type="email"
                     value={formData.email}
                     onChange={event=> handleChange('email', event?.target.value)}
                     disabled={isLoading}
                     className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500" />

                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.email}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="mb-1 block text-sm font-medium text-gray-700">
                            Contraseña
                    </label>

                    <input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={event => handleChange('password', event.target.value)}
                        disabled={isLoading}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-gray-500" />

                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.password}
                        </p>
                    )}
                </div>

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-md bg-gray-900 px-4 py-2 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50">
                        {isLoading ? 'Iniciando sesión...': 'Iniciar sesión'}
                </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
                ¿No tienes una cuenta?{' '}
                <Link
                   to="/register"
                   className="font-medium text-gray-900 underline">
                     Registrarse
                </Link>
            </p>
        </section>
      </main>
    );

}

export default LoginPage;