import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email({ error: 'Debe ser un correo electrónico válido' }),
  password: z.string().min(1, { error: 'La contraseña es obligatoria' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
