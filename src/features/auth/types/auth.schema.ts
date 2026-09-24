import { z } from 'zod';

export const userSchema = z.object({
    id: z.string(),
    name: z.string(),
    email: z.email(),
    role: z.enum(['admin', 'user']),
    profilePicture: z.string().optional(),
});

export const authSessionSchema = z.object({
    token: z.string().min(1),
    user: userSchema,
});

export const loginSchema = z.object({
    email: z.email('Ingresa un correo electrónico válido.'),
    password: z
        .string()
        .min(1, 'La contraseña es obligatoria.'),
});

export const registerSchema = z.object({
    name: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres.')
        .max(100, 'El nombre no puede superar los 100 caracteres.'),

    email: z.email('Ingresa un correo electrónico válido.'),

    documentId: z
        .string()
        .min(5, 'El documento debe tener al menos 5 caracteres.'),

    password: z
        .string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres.'),
});

export type AuthSession = z.infer<typeof authSessionSchema>;
export type User = z.infer<typeof userSchema>;

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;