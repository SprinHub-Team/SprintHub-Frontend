import { z } from 'zod';
import type { AuthSession } from '../types/auth.types';

export const authSessionSchema = z.object({
  token: z.string().min(1, { error: 'La sesión no contiene un token válido' }),
  user: z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    email: z.email({ error: 'La sesión no contiene un correo válido' }),
    profilePicture: z.string(),
  }),
});

export type AuthSessionInput = z.infer<typeof authSessionSchema>;

export function isAuthSession(value: unknown): value is AuthSession {
  return authSessionSchema.safeParse(value).success;
}
