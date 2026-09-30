import { z, type ZodType } from 'zod';
import { ApiError } from '../api/errors/ApiError';
import { errorHandler } from '../api/errors/errorHandler';
import { boardDetailsDtoSchema } from '@/features/boards/schemas/boardDtoSchema';
import { columnDtoSchema } from '@/features/columns/schemas/columnDtoSchema';
import { cardDtoSchema } from '@/features/cards/schemas/cardDtoSchema';
import { commentDtoSchema } from '@/features/comments/schemas/commentDtoSchema';
import type { BoardDetailsDto } from '@/features/boards/types/board.dto';
import type { ColumnDto } from '@/features/columns/types/column.dto';
import type { CardDto } from '@/features/cards/types/card.dto';
import type { CommentDto } from '@/features/comments/types/comment.dto';
import {
  SOCKET_BROADCAST_EVENTS,
  SOCKET_EMIT_EVENTS,
  type AddCardFilePayload,
  type CardCreatedPayload,
  type CardDeletedPayload,
  type CardFileAddedPayload,
  type CardFileRemovedPayload,
  type CardUpdatedPayload,
  type ColumnCreatedPayload,
  type ColumnDeletedPayload,
  type ColumnUpdatedPayload,
  type CommentCreatedPayload,
  type CommentDeletedPayload,
  type CommentUpdatedPayload,
  type CreateCardPayload,
  type CreateColumnPayload,
  type CreateCommentPayload,
  type DeleteCardPayload,
  type DeleteColumnPayload,
  type DeleteCommentPayload,
  type RemoveCardFilePayload,
  type UpdateCardPayload,
  type UpdateColumnPayload,
  type UpdateCommentPayload,
} from './socketEvents';
import {
  connectSocket as connectSocketClient,
  disconnectSocket as disconnectSocketClient,
  emitSocketAck,
  subscribeSocketEvent,
  subscribeSocketStatus,
  type SocketConnectionStatus,
} from './socketClient';

interface AckRecord {
  ok: boolean;
  error?: unknown;
  [key: string]: unknown;
}

function parseAck(ack: unknown): AckRecord {
  if (typeof ack !== 'object' || ack === null || !('ok' in ack)) {
    throw new ApiError({
      message: 'La respuesta del servidor realtime no tiene un formato válido',
      code: 'unknown',
    });
  }
  const candidate = ack as { ok?: unknown };
  if (typeof candidate.ok !== 'boolean') {
    throw new ApiError({
      message: 'La respuesta del servidor realtime no tiene un formato válido',
      code: 'unknown',
    });
  }
  return ack as AckRecord;
}

function requireAckSuccess(ack: unknown): AckRecord {
  const parsed = parseAck(ack);
  if (!parsed.ok) {
    throw new ApiError({
      message: typeof parsed.error === 'string' && parsed.error.length > 0
        ? parsed.error
        : 'La operación realtime no se pudo completar',
      code: 'server',
    });
  }
  return parsed;
}

function unwrapAckData<TData>(ack: unknown, key: string, schema: ZodType<TData>): TData {
  const parsed = requireAckSuccess(ack);
  const result = schema.safeParse(parsed[key]);
  if (!result.success) {
    throw new ApiError({
      message: 'Los datos realtime recibidos no tienen el formato esperado',
      code: 'validation',
    });
  }
  return result.data;
}

async function requestAck(
  event: Parameters<typeof emitSocketAck>[0],
  payload: unknown,
): Promise<unknown> {
  try {
    return await emitSocketAck(event, payload);
  } catch (error: unknown) {
    throw errorHandler(error);
  }
}

export function startRealtimeSession(token: string): void {
  connectSocketClient(token);
}

export function stopRealtimeSession(): void {
  disconnectSocketClient();
}

export function subscribeRealtimeStatus(
  handler: (status: SocketConnectionStatus) => void,
): () => void {
  return subscribeSocketStatus(handler);
}

export async function joinBoard(boardId: string): Promise<BoardDetailsDto> {
  const ack = await requestAck(SOCKET_EMIT_EVENTS.boardJoin, boardId);
  return unwrapAckData(ack, 'board', boardDetailsDtoSchema);
}

export function leaveBoard(boardId: string): void {
  void emitSocketAck(SOCKET_EMIT_EVENTS.boardLeave, boardId).catch(() => undefined);
}

export async function createColumn(payload: CreateColumnPayload): Promise<ColumnDto> {
  const ack = await requestAck(SOCKET_EMIT_EVENTS.columnCreate, payload);
  return unwrapAckData(ack, 'column', columnDtoSchema);
}

export async function updateColumn(payload: UpdateColumnPayload): Promise<ColumnDto> {
  const ack = await requestAck(SOCKET_EMIT_EVENTS.columnUpdate, payload);
  return unwrapAckData(ack, 'column', columnDtoSchema);
}

export async function deleteColumn(columnId: DeleteColumnPayload): Promise<void> {
  const ack = await requestAck(SOCKET_EMIT_EVENTS.columnDelete, columnId);
  requireAckSuccess(ack);
}

export async function createCard(payload: CreateCardPayload): Promise<CardDto> {
  const ack = await requestAck(SOCKET_EMIT_EVENTS.cardCreate, payload);
  return unwrapAckData(ack, 'card', cardDtoSchema);
}

export async function updateCard(payload: UpdateCardPayload): Promise<CardDto> {
  const ack = await requestAck(SOCKET_EMIT_EVENTS.cardUpdate, payload);
  return unwrapAckData(ack, 'card', cardDtoSchema);
}

export async function deleteCard(cardId: DeleteCardPayload): Promise<void> {
  const ack = await requestAck(SOCKET_EMIT_EVENTS.cardDelete, cardId);
  requireAckSuccess(ack);
}

export async function addCardFile(payload: AddCardFilePayload): Promise<CardDto> {
  const ack = await requestAck(SOCKET_EMIT_EVENTS.cardFileAdd, payload);
  return unwrapAckData(ack, 'card', cardDtoSchema);
}

export async function removeCardFile(payload: RemoveCardFilePayload): Promise<CardDto> {
  const ack = await requestAck(SOCKET_EMIT_EVENTS.cardFileRemove, payload);
  return unwrapAckData(ack, 'card', cardDtoSchema);
}

export async function createComment(payload: CreateCommentPayload): Promise<CommentDto> {
  const ack = await requestAck(SOCKET_EMIT_EVENTS.commentCreate, payload);
  return unwrapAckData(ack, 'comment', commentDtoSchema);
}

export async function updateComment(payload: UpdateCommentPayload): Promise<CommentDto> {
  const ack = await requestAck(SOCKET_EMIT_EVENTS.commentUpdate, payload);
  return unwrapAckData(ack, 'comment', commentDtoSchema);
}

export async function deleteComment(commentId: DeleteCommentPayload): Promise<void> {
  const ack = await requestAck(SOCKET_EMIT_EVENTS.commentDelete, commentId);
  requireAckSuccess(ack);
}

export type BoardEventHandlers = {
  onColumnCreated?: (payload: ColumnCreatedPayload) => void;
  onColumnUpdated?: (payload: ColumnUpdatedPayload) => void;
  onColumnDeleted?: (payload: ColumnDeletedPayload) => void;
  onCardCreated?: (payload: CardCreatedPayload) => void;
  onCardUpdated?: (payload: CardUpdatedPayload) => void;
  onCardDeleted?: (payload: CardDeletedPayload) => void;
  onCardFileAdded?: (payload: CardFileAddedPayload) => void;
  onCardFileRemoved?: (payload: CardFileRemovedPayload) => void;
  onCommentCreated?: (payload: CommentCreatedPayload) => void;
  onCommentUpdated?: (payload: CommentUpdatedPayload) => void;
  onCommentDeleted?: (payload: CommentDeletedPayload) => void;
};

export function subscribeToBoardEvents(handlers: BoardEventHandlers): () => void {
  const unsubscribers: (() => void)[] = [];

  const bind = <TData>(
    event: Parameters<typeof subscribeSocketEvent>[0],
    schema: ZodType<TData>,
    handler: ((payload: TData) => void) | undefined,
  ): void => {
    if (!handler) return;
    unsubscribers.push(
      subscribeSocketEvent(event, (payload: unknown) => {
        const result = schema.safeParse(payload);
        if (result.success) {
          handler(result.data);
        } else if (typeof console !== 'undefined') {
          console.warn(`[socket] Payload inválido en ${event}:`, result.error.issues);
        }
      }),
    );
  };

  bind(SOCKET_BROADCAST_EVENTS.columnCreated, columnDtoSchema, handlers.onColumnCreated);
  bind(SOCKET_BROADCAST_EVENTS.columnUpdated, columnDtoSchema, handlers.onColumnUpdated);
  bind(
    SOCKET_BROADCAST_EVENTS.columnDeleted,
    columnDeletedSchema,
    handlers.onColumnDeleted,
  );
  bind(SOCKET_BROADCAST_EVENTS.cardCreated, cardDtoSchema, handlers.onCardCreated);
  bind(SOCKET_BROADCAST_EVENTS.cardUpdated, cardDtoSchema, handlers.onCardUpdated);
  bind(SOCKET_BROADCAST_EVENTS.cardDeleted, cardDeletedSchema, handlers.onCardDeleted);
  bind(SOCKET_BROADCAST_EVENTS.cardFileAdded, cardDtoSchema, handlers.onCardFileAdded);
  bind(SOCKET_BROADCAST_EVENTS.cardFileRemoved, cardDtoSchema, handlers.onCardFileRemoved);
  bind(SOCKET_BROADCAST_EVENTS.commentCreated, commentDtoSchema, handlers.onCommentCreated);
  bind(SOCKET_BROADCAST_EVENTS.commentUpdated, commentDtoSchema, handlers.onCommentUpdated);
  bind(SOCKET_BROADCAST_EVENTS.commentDeleted, commentDeletedSchema, handlers.onCommentDeleted);

  return () => {
    unsubscribers.forEach((unsubscribe) => unsubscribe());
  };
}

const columnDeletedSchema = z.object({ columnId: z.string() });
const cardDeletedSchema = z.string();
const commentDeletedSchema = z.string();
