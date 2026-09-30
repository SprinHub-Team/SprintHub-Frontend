import { z } from 'zod';
import { apiClient } from '@/services/api/client';
import { errorHandler } from '@/services/api/errors/errorHandler';
import { userProfileDtoSchema } from '../schemas/profileDtoSchema';
import type { UpdateProfileInput, UserProfile } from '../types/profile.types';

const deleteAccountResponseSchema = z.object({
  message: z.string(),
  data: userProfileDtoSchema,
});

export async function getMyProfile(): Promise<UserProfile> {
  try {
    const response = await apiClient.get<unknown>('/users/me');
    const result = userProfileDtoSchema.safeParse(response.data);
    if (!result.success) {
      throw new z.ZodError(result.error.issues);
    }
    return result.data;
  } catch (error: unknown) {
    throw errorHandler(error);
  }
}

export async function updateMyProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<UserProfile> {
  try {
    const form = new FormData();
    if (input.name !== undefined) form.append('name', input.name);
    if (input.email !== undefined) form.append('email', input.email);
    if (input.document !== undefined) form.append('document', input.document);
    if (input.password !== undefined && input.password.length > 0) form.append('password', input.password);
    if (input.file) form.append('file', input.file);

    const response = await apiClient.put<unknown>(`/users/${userId}`, form);
    const result = userProfileDtoSchema.safeParse(response.data);
    if (!result.success) {
      throw new z.ZodError(result.error.issues);
    }
    return result.data;
  } catch (error: unknown) {
    throw errorHandler(error);
  }
}

export async function deleteMyAccount(): Promise<void> {
  try {
    const response = await apiClient.delete<unknown>('/users');
    const result = deleteAccountResponseSchema.safeParse(response.data);
    if (!result.success) {
      throw new z.ZodError(result.error.issues);
    }
  } catch (error: unknown) {
    throw errorHandler(error);
  }
}
