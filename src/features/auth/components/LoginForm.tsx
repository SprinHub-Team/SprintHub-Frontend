import { useState, type FormEvent } from 'react';
import { LogIn } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert } from '@/components/ui/Alert/Alert';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { ROUTES, readReturnPath } from '@/app/routes';
import { zodFieldErrors } from '@/lib/zodFormErrors';
import { loginSchema, type LoginFormData } from '../schemas/loginSchema';
import { useLogin } from '../hooks/useLogin';
import styles from './LoginForm.module.css';

export function LoginForm() {
  const [values, setValues] = useState<LoginFormData>({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { loading, error, submit } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();

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
    const succeeded = await submit(parsed.data);
    if (succeeded) {
      // Vuelve a la ruta que el guard recordó en state.from (si la hubo).
      navigate(readReturnPath(location.state, ROUTES.dashboard), { replace: true });
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className={styles.form}>
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

      <Button type="submit" loading={loading} icon={<LogIn aria-hidden="true" className="icon-md" />}>
        Iniciar sesión
      </Button>

      <p className={styles.switch}>
        ¿Aún no tienes cuenta?{' '}
        <button
          type="button"
          onClick={() => navigate(ROUTES.register)}
          className={styles.switchAction}
        >
          Regístrate
        </button>
      </p>
    </form>
  );
}
