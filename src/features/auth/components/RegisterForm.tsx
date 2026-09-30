import { useState, type FormEvent } from 'react';
import { UserPlus } from 'lucide-react';
import { Alert } from '@/components/ui/Alert/Alert';
import { Button } from '@/components/ui/Button/Button';
import { FileDropzone } from '@/components/ui/FileDropzone/FileDropzone';
import { Input } from '@/components/ui/Input/Input';
import { APP_ROUTES, navigateTo } from '@/app/router/routes';
import { zodFieldErrors } from '@/lib/zodFormErrors';
import { MEDIA_RULE } from '@/services/uploads/fileValidation';
import { registerSchema, type RegisterFormData } from '../schemas/registerSchema';
import { useRegister } from '../hooks/useRegister';

export function RegisterForm() {
  const [values, setValues] = useState<RegisterFormData>({
    name: '',
    email: '',
    document: '',
    password: '',
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const { loading, error, submit } = useRegister();

  const handleChange = (field: keyof RegisterFormData) => (
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
    const parsed = registerSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(zodFieldErrors(parsed.error.issues));
      return;
    }
    setFieldErrors({});
    const succeeded = await submit({ ...parsed.data, file: avatar });
    if (succeeded) {
      setAvatar(null);
      navigateTo(APP_ROUTES.login);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {error && !error.hasValidationIssues ? (
        <Alert variant="danger" title="No se pudo completar el registro">
          {error.message}
        </Alert>
      ) : null}

      <Input
        label="Nombre completo"
        type="text"
        name="name"
        autoComplete="name"
        placeholder="Ana María Rodríguez"
        required
        value={values.name}
        onChange={handleChange('name')}
        error={fieldErrors.name}
        disabled={loading}
      />

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
        label="Documento de identidad"
        type="text"
        name="document"
        autoComplete="off"
        placeholder="1023456789"
        required
        hint="Mínimo 5 caracteres, tal como aparecerá en tu perfil."
        value={values.document}
        onChange={handleChange('document')}
        error={fieldErrors.document}
        disabled={loading}
      />

      <Input
        label="Contraseña"
        type="password"
        name="password"
        autoComplete="new-password"
        placeholder="••••••••"
        required
        hint="Mínimo 6 caracteres."
        value={values.password}
        onChange={handleChange('password')}
        error={fieldErrors.password}
        disabled={loading}
      />

      <FileDropzone
        rule={MEDIA_RULE}
        value={avatar}
        onChange={setAvatar}
        label="Foto de perfil (opcional)"
        hint="Se enviará como parte del registro y será visible para tu equipo."
        disabled={loading}
        compact
      />

      <Button
        type="submit"
        loading={loading}
        icon={<UserPlus aria-hidden="true" className="size-4" />}
      >
        Crear cuenta
      </Button>

      <p className="text-center text-sm text-(--text-muted)">
        ¿Ya tienes cuenta?{' '}
        <button
          type="button"
          onClick={() => navigateTo(APP_ROUTES.login)}
          className="font-semibold text-(--cream) underline decoration-(--taupe) underline-offset-4 transition-colors duration-200 ease-out hover:text-(--sand)"
        >
          Inicia sesión
        </button>
      </p>
    </form>
  );
}
