import { z } from 'zod';
import { apiClient } from '@/services/api/client';
import { errorHandler } from '@/services/api/errors/errorHandler';
import { groupDetailsDtoListSchema, groupDetailsDtoSchema, groupDtoSchema } from '../schemas/groupDtoSchema';
import type { Group, GroupDetails, GroupMemberRole } from '../types/group.types';

const groupsEnvelopeSchema = z.object({ data: groupDetailsDtoListSchema });
const groupEnvelopeSchema = z.object({ data: groupDtoSchema });
const groupDetailsEnvelopeSchema = z.object({ data: groupDetailsDtoSchema });

export interface CreateGroupPayload {
  name: string;
  description?: string;
  file?: File | null;
}

export interface AddMemberPayload {
  email: string;
  role: GroupMemberRole;
}

export interface UpdateGroupPayload {
  name?: string;
  description?: string;
  file?: File | null;
}

export async function getMyGroups(): Promise<GroupDetails[]> {
  try {
    const response = await apiClient.get<unknown>('/groups');
    const result = groupsEnvelopeSchema.safeParse(response.data);
    if (!result.success) {
      throw new z.ZodError(result.error.issues);
    }
    return result.data.data;
  } catch (error: unknown) {
    throw errorHandler(error);
  }
}

export async function createGroup(payload: CreateGroupPayload): Promise<Group> {
  try {
    const body: FormData | Record<string, string> = payload.file
      ? buildGroupForm(payload)
      : { name: payload.name, description: payload.description ?? '' };
    const response = await apiClient.post<unknown>('/groups', body);
    const result = groupEnvelopeSchema.safeParse(response.data);
    if (!result.success) {
      throw new z.ZodError(result.error.issues);
    }
    return result.data.data;
  } catch (error: unknown) {
    throw errorHandler(error);
  }
}

export async function updateGroup(groupId: string, payload: UpdateGroupPayload): Promise<GroupDetails> {
  try {
    const form = new FormData();
    if (payload.name !== undefined) form.append('name', payload.name);
    if (payload.description !== undefined) form.append('description', payload.description);
    if (payload.file) form.append('file', payload.file);

    const response = await apiClient.put<unknown>(`/groups/${groupId}`, form);
    const result = groupDetailsEnvelopeSchema.safeParse(response.data);
    if (!result.success) {
      throw new z.ZodError(result.error.issues);
    }
    return result.data.data;
  } catch (error: unknown) {
    throw errorHandler(error);
  }
}

function buildGroupForm(payload: CreateGroupPayload): FormData {
  const form = new FormData();
  form.append('name', payload.name);
  form.append('description', payload.description ?? '');
  if (payload.file) {
    form.append('file', payload.file);
  }
  return form;
}

export async function deleteGroup(groupId: string): Promise<void> {
  try {
    await apiClient.delete<unknown>(`/groups/${groupId}`);
  } catch (error: unknown) {
    throw errorHandler(error);
  }
}

export async function addGroupMember(groupId: string, payload: AddMemberPayload): Promise<GroupDetails> {
  try {
    const response = await apiClient.post<unknown>(`/groups/${groupId}/members`, payload);
    const result = groupDetailsEnvelopeSchema.safeParse(response.data);
    if (!result.success) {
      throw new z.ZodError(result.error.issues);
    }
    return result.data.data;
  } catch (error: unknown) {
    throw errorHandler(error);
  }
}

export async function removeGroupMember(groupId: string, userId: string): Promise<GroupDetails> {
  try {
    const response = await apiClient.delete<unknown>(`/groups/${groupId}/members/${userId}`);
    const result = groupDetailsEnvelopeSchema.safeParse(response.data);
    if (!result.success) {
      throw new z.ZodError(result.error.issues);
    }
    return result.data.data;
  } catch (error: unknown) {
    throw errorHandler(error);
  }
}
