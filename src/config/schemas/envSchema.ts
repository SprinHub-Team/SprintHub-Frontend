import { z } from 'zod';

export const envSchema = z.object({
  VITE_API_URL: z
    .url({ error: 'VITE_API_URL debe ser una URL válida' })
    .default('http://localhost:4000'),

  VITE_SOCKET_URL: z
    .url({ error: 'VITE_SOCKET_URL debe ser una URL válida' })
    .default('http://localhost:4000'),

});

export type EnvSchema = z.infer<typeof envSchema>;
