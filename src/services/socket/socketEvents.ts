import type { BoardDetailsDto } from '@/features/boards/types/board.dto';
import type { ColumnDto } from '@/features/columns/types/column.dto';
import type { CardDto, CardPriority } from '@/features/cards/types/card.dto';
import type { CommentDto } from '@/features/comments/types/comment.dto';

export const SOCKET_EMIT_EVENTS = {
  boardJoin: 'board:join',
  boardLeave: 'board:leave',
  columnCreate: 'column:create',
  columnUpdate: 'column:update',
  columnDelete: 'column:delete',
  cardCreate: 'card:create',
  cardUpdate: 'card:update',
  cardDelete: 'card:delete',
  cardFileAdd: 'card:fileAdd',
  cardFileRemove: 'card:fileRemove',
  commentCreate: 'comment:create',
  commentUpdate: 'comment:update',
  commentDelete: 'comment:delete',
} as const;

export const SOCKET_BROADCAST_EVENTS = {
  columnCreated: 'column:created',
  columnUpdated: 'column:updated',
  columnDeleted: 'column:deleted',
  cardCreated: 'card:created',
  cardUpdated: 'card:updated',
  cardDeleted: 'card:deleted',
  cardFileAdded: 'card:fileAdded',
  cardFileRemoved: 'card:fileRemoved',
  commentCreated: 'comment:created',
  commentUpdated: 'comment:updated',
  commentDeleted: 'comment:deleted',
} as const;

export type SocketEmitEvent = (typeof SOCKET_EMIT_EVENTS)[keyof typeof SOCKET_EMIT_EVENTS];

export type SocketBroadcastEvent =
  (typeof SOCKET_BROADCAST_EVENTS)[keyof typeof SOCKET_BROADCAST_EVENTS];

export type SocketAck<TData> = ({ ok: true } & TData) | { ok: false; error: string };

export type BoardJoinPayload = string;
export type BoardLeavePayload = string;

export type CreateColumnPayload = {
  name: string;
  boardId: string;
};

export type UpdateColumnPayload = {
  columnId: string;
  name: string;
};

export type DeleteColumnPayload = string;

export type CreateCardPayload = {
  title: string;
  description?: string;
  columnId: string;
  assignedTo?: string;
  priority?: CardPriority;
};

export type UpdateCardPayload = {
  cardId: string;
  title?: string;
  description?: string;
  columnId: string;
  assignedTo?: string;
  priority?: CardPriority;
};

export type DeleteCardPayload = string;

export type CardFileDataPayload = {
  fileName: string;
  buffer: Uint8Array;
};

export type AddCardFilePayload = {
  cardId: string;
  fileData: CardFileDataPayload;
};

export type RemoveCardFilePayload = {
  cardId: string;
  filePath: string;
};

export type CreateCommentPayload = {
  name: string;
  description: string;
  cardId: string;
};

export type UpdateCommentPayload = {
  commentId: string;
  name?: string;
  description?: string;
};

export type DeleteCommentPayload = string;

export type BoardJoinAck = SocketAck<{ board: BoardDetailsDto }>;
export type ColumnAck = SocketAck<{ column: ColumnDto }>;
export type CardAck = SocketAck<{ card: CardDto }>;
export type CommentAck = SocketAck<{ comment: CommentDto }>;
export type EmptyAck = SocketAck<Record<string, never>>;

export type ColumnCreatedPayload = ColumnDto;
export type ColumnUpdatedPayload = ColumnDto;
export type ColumnDeletedPayload = { columnId: string };
export type CardCreatedPayload = CardDto;
export type CardUpdatedPayload = CardDto;
export type CardDeletedPayload = string;
export type CardFileAddedPayload = CardDto;
export type CardFileRemovedPayload = CardDto;
export type CommentCreatedPayload = CommentDto;
export type CommentUpdatedPayload = CommentDto;
export type CommentDeletedPayload = string;
