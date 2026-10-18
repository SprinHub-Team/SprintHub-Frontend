import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, { error: 'El nombre debe tener al menos 2 caracteres' })
    .max(100, { error: 'El nombre no puede superar 100 caracteres' }),
  email: z.email({ error: 'Debe ser un correo electrónico válido' }),
  document: z.string().min(5, { error: 'El documento debe tener al menos 5 caracteres' }),
  password: z.string().min(6, { error: 'La contraseña debe tener al menos 6 caracteres' }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
