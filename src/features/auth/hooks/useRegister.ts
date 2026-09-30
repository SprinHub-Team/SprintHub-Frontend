import { useCallback, useState } from 'react';
import { useToast } from '@/components/ui/Toast/Toast';
import { ApiError } from '@/services/api/errors/ApiError';
import { errorHandler } from '@/services/api/errors/errorHandler';
import { useAuthStore } from '../store/useAuthStore';
import { registerSchema, type RegisterFormData } from '../schemas/registerSchema';

export type RegisterSubmitData = RegisterFormData & { file?: File | null };

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const register = useAuthStore((state) => state.register);
  const toast = useToast();

  const submit = useCallback(
    async (data: RegisterSubmitData): Promise<boolean> => {
      const { file, ...textData } = data;
      const parsed = registerSchema.safeParse(textData);
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
        await register({ ...parsed.data, file: file ?? null });
        toast.success('Usuario registrado exitosamente', 'Ya puedes iniciar sesión');
        return true;
      } catch (caught: unknown) {
        setError(errorHandler(caught));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [register, toast],
  );

  return { loading, error, submit };
}
