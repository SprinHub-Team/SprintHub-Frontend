import { z } from 'zod';
import { apiClient } from '@/services/api/client';
import { errorHandler } from '@/services/api/errors/errorHandler';
import { authSessionSchema } from '../schemas/sessionSchema';
import type { AuthSession, LoginPayload, RegisterPayload } from '../types/auth.types';

const loginResponseSchema = authSessionSchema;

const registerResponseSchema = z.object({
  message: z.string(),
});

export async function login(payload: LoginPayload): Promise<AuthSession> {
  try {
    const response = await apiClient.post<unknown>('/auth/login', payload);
    const result = loginResponseSchema.safeParse(response.data);
    if (!result.success) {
      throw errorHandler(
        new z.ZodError(result.error.issues),
      );
    }
    return result.data;
  } catch (error: unknown) {
    throw errorHandler(error);
  }
}

export async function register(payload: RegisterPayload): Promise<string> {
  try {
    const body: FormData | Record<string, string> = payload.file
      ? buildRegisterForm(payload)
      : {
          name: payload.name,
          email: payload.email,
          document: payload.document,
          password: payload.password,
        };
    const response = await apiClient.post<unknown>('/auth/register', body);
    const result = registerResponseSchema.safeParse(response.data);
    if (!result.success) {
      throw errorHandler(new z.ZodError(result.error.issues));
    }
    return result.data.message;
  } catch (error: unknown) {
    throw errorHandler(error);
  }
}

function buildRegisterForm(payload: RegisterPayload): FormData {
  const form = new FormData();
  form.append('name', payload.name);
  form.append('email', payload.email);
  form.append('document', payload.document);
  form.append('password', payload.password);
  if (payload.file) {
    form.append('file', payload.file);
  }
  return form;
}
