import { useState, type FormEvent } from 'react';
import { LogIn } from 'lucide-react';
import { Alert } from '@/components/ui/Alert/Alert';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { APP_ROUTES, navigateTo } from '@/app/router/routes';
import { zodFieldErrors } from '@/lib/zodFormErrors';
import { loginSchema, type LoginFormData } from '../schemas/loginSchema';
import { useLogin } from '../hooks/useLogin';

export function LoginForm() {
  const [values, setValues] = useState<LoginFormData>({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { loading, error, submit } = useLogin();

  const handleChange = (field: keyof LoginFormData) => (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(zodFieldErrors(parsed.error.issues));
      return;
    }
    setFieldErrors({});
    await submit(parsed.data);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {error && !error.hasValidationIssues ? (
        <Alert variant={error.isUnauthorized || error.isNetworkError ? 'warning' : 'danger'} title="No se pudo iniciar sesión">
          {error.message}
        </Alert>
      ) : null}

      <Input
        label="Correo electrónico"
        type="email"
        name="email"
        autoComplete="email"
        placeholder="tu@correo.com"
        required
        value={values.email}
        onChange={handleChange('email')}
        error={fieldErrors.email}
        disabled={loading}
      />

      <Input
        label="Contraseña"
        type="password"
        name="password"
        autoComplete="current-password"
        placeholder="••••••••"
        required
        value={values.password}
        onChange={handleChange('password')}
        error={fieldErrors.password}
        disabled={loading}
      />

      <Button type="submit" loading={loading} icon={<LogIn aria-hidden="true" className="size-4" />}>
        Iniciar sesión
      </Button>

      <p className="text-center text-sm text-(--text-muted)">
        ¿Aún no tienes cuenta?{' '}
        <button
          type="button"
          onClick={() => navigateTo(APP_ROUTES.register)}
          className="font-semibold text-(--cream) underline decoration-(--taupe) underline-offset-4 transition-colors duration-200 ease-out hover:text-(--sand)"
        >
          Regístrate
        </button>
      </p>
    </form>
  );
}
