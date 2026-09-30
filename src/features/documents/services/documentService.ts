import { z } from 'zod';
import { apiClient } from '@/services/api/client';
import { errorHandler } from '@/services/api/errors/errorHandler';
import { projectDocumentDtoListSchema, projectDocumentDtoSchema } from '../schemas/documentDtoSchema';
import type { ProjectDocumentDto } from '../types/document.types';

export interface UploadDocumentPayload {
  title: string;
  file: File;
}

export async function getGroupDocuments(groupId: string): Promise<ProjectDocumentDto[]> {
  try {
    const response = await apiClient.get<unknown>(`/project-documents/group/${groupId}`);
    const result = projectDocumentDtoListSchema.safeParse(response.data);
    if (!result.success) {
      throw new z.ZodError(result.error.issues);
    }
    return result.data;
  } catch (error: unknown) {
    throw errorHandler(error);
  }
}

export async function uploadGroupDocument(
  groupId: string,
  payload: UploadDocumentPayload,
): Promise<ProjectDocumentDto> {
  try {
    const form = new FormData();
    form.append('title', payload.title);
    form.append('file', payload.file);

    const response = await apiClient.post<unknown>(`/project-documents/${groupId}`, form);
    const result = projectDocumentDtoSchema.safeParse(response.data);
    if (!result.success) {
      throw new z.ZodError(result.error.issues);
    }
    return result.data;
  } catch (error: unknown) {
    throw errorHandler(error);
  }
}

export async function deleteProjectDocument(documentId: string): Promise<void> {
  try {
    await apiClient.delete<unknown>(`/project-documents/${documentId}`);
  } catch (error: unknown) {
    throw errorHandler(error);
  }
}
