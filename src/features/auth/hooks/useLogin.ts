import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/Toast/Toast';
import { ApiError } from '@/services/api/errors/ApiError';
import { errorHandler } from '@/services/api/errors/errorHandler';
import { useAuthStore } from '../store/useAuthStore';
import { loginSchema, type LoginFormData } from '../schemas/loginSchema';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const login = useAuthStore((state) => state.login);
  const toast = useToast();

  const submit = useCallback(
    async (data: LoginFormData): Promise<boolean> => {
      const parsed = loginSchema.safeParse(data);
      if (!parsed.success) {
        setError(
          new ApiError({
            message: 'Revisa los campos del formulario',
            code: 'validation',
            issues: parsed.error.issues.map((issue) => ({
              path: issue.path.join('.'),
              message: issue.message,
            })),
          }),
        );
        return false;
      }

      setLoading(true);
      setError(null);
      try {
        await login(parsed.data);
        toast.success('Sesión iniciada correctamente', '¡Bienvenido de nuevo!');
        return true;
      } catch (caught: unknown) {
        setError(errorHandler(caught));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [login, toast],
  );

  return { loading, error, submit };
}
