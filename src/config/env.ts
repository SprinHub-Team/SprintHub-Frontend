import { envSchema } from './schemas/envSchema';

function loadEnv() {
  const parsed = envSchema.safeParse({
    VITE_API_URL: import.meta.env.VITE_API_URL,
    VITE_SOCKET_URL: import.meta.env.VITE_SOCKET_URL,
  });

  if (!parsed.success) {
    const detalles = parsed.error.issues
      .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
      .join(' | ');
    throw new Error(`Configuración de entorno inválida — ${detalles}`);
  }

  return {
    apiUrl: parsed.data.VITE_API_URL,
    socketUrl: parsed.data.VITE_SOCKET_URL,
  };
}

export const env = loadEnv();

export type Env = ReturnType<typeof loadEnv>;
