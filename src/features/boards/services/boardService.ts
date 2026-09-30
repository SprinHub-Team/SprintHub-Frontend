import { z } from 'zod';
import { apiClient } from '@/services/api/client';
import { errorHandler } from '@/services/api/errors/errorHandler';
import {
  boardDetailsDtoSchema,
  boardDtoSchema,
  boardTemplateDtoSchema,
} from '../schemas/boardDtoSchema';
import type { Board, BoardDetails, BoardTemplate } from '../types/board.types';

const boardListSchema = z.array(boardDtoSchema);
const boardCreatedEnvelopeSchema = z.object({ data: boardDetailsDtoSchema });
const templateListSchema = z.array(boardTemplateDtoSchema);

export interface CreateBoardPayload {
  title: string;
  description?: string;
  groupId: string;
  templateId?: string;
}

export async function getBoardsByGroup(groupId: string): Promise<Board[]> {
  try {
    const response = await apiClient.get<unknown>(`/boards/group/${groupId}`);
    const result = boardListSchema.safeParse(response.data);
    if (!result.success) {
      throw new z.ZodError(result.error.issues);
    }
    return result.data;
  } catch (error: unknown) {
    throw errorHandler(error);
  }
}

export async function createBoard(payload: CreateBoardPayload): Promise<BoardDetails> {
  try {
    const response = await apiClient.post<unknown>('/boards', payload);
    const result = boardCreatedEnvelopeSchema.safeParse(response.data);
    if (!result.success) {
      throw new z.ZodError(result.error.issues);
    }
    return result.data.data;
  } catch (error: unknown) {
    throw errorHandler(error);
  }
}

export async function deleteBoard(boardId: string): Promise<void> {
  try {
    await apiClient.delete<unknown>(`/boards/${boardId}`);
  } catch (error: unknown) {
    throw errorHandler(error);
  }
}

export async function getBoardTemplates(): Promise<BoardTemplate[]> {
  try {
    const response = await apiClient.get<unknown>('/templates');
    const result = templateListSchema.safeParse(response.data);
    if (!result.success) {
      throw new z.ZodError(result.error.issues);
    }
    return result.data;
  } catch (error: unknown) {
    throw errorHandler(error);
  }
}
