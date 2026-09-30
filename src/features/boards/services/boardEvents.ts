import type { BoardDetails } from '../types/board.types';
import type { Card } from '@/features/cards/types/card.types';
import type { BoardColumn } from '@/features/columns/types/column.types';
import type { Comment } from '@/features/comments/types/comment.types';

export function applyColumnCreated(board: BoardDetails, column: BoardColumn): BoardDetails {
  if (board.columns.some((candidate) => candidate.id === column.id)) {
    return board;
  }
  return { ...board, columns: [...board.columns, column] };
}

export function applyColumnUpdated(board: BoardDetails, column: BoardColumn): BoardDetails {
  if (!board.columns.some((candidate) => candidate.id === column.id)) {
    return board;
  }
  return {
    ...board,
    columns: board.columns.map((candidate) => (candidate.id === column.id ? column : candidate)),
  };
}

export function applyColumnDeleted(board: BoardDetails, columnId: string): BoardDetails {
  return { ...board, columns: board.columns.filter((column) => column.id !== columnId) };
}

export function applyCardCreated(board: BoardDetails, card: Card): BoardDetails {
  return {
    ...board,
    columns: board.columns.map((column) => {
      if (column.id !== card.columnId) return column;
      if (column.cards.some((candidate) => candidate.id === card.id)) return column;
      return { ...column, cards: [...column.cards, card] };
    }),
  };
}

export function applyCardUpdated(board: BoardDetails, card: Card): BoardDetails {
  return {
    ...board,
    columns: board.columns.map((column) => {
      if (column.id !== card.columnId) {
        return {
          ...column,
          cards: column.cards.filter((candidate) => candidate.id !== card.id),
        };
      }
      if (column.cards.some((candidate) => candidate.id === card.id)) {
        return {
          ...column,
          cards: column.cards.map((candidate) => (candidate.id === card.id ? card : candidate)),
        };
      }
      return { ...column, cards: [...column.cards, card] };
    }),
  };
}

export function applyCardDeleted(board: BoardDetails, cardId: string): BoardDetails {
  return {
    ...board,
    columns: board.columns.map((column) => ({
      ...column,
      cards: column.cards.filter((card) => card.id !== cardId),
    })),
  };
}

export function applyCommentCreated(board: BoardDetails, comment: Comment): BoardDetails {
  return {
    ...board,
    columns: board.columns.map((column) => ({
      ...column,
      cards: column.cards.map((card) => {
        if (card.id !== comment.cardId) return card;
        if (card.comments.some((candidate) => candidate.id === comment.id)) return card;
        return { ...card, comments: [...card.comments, comment] };
      }),
    })),
  };
}

export function applyCommentUpdated(board: BoardDetails, comment: Comment): BoardDetails {
  return {
    ...board,
    columns: board.columns.map((column) => ({
      ...column,
      cards: column.cards.map((card) => {
        if (card.id !== comment.cardId) return card;
        if (!card.comments.some((candidate) => candidate.id === comment.id)) return card;
        return {
          ...card,
          comments: card.comments.map((candidate) => (candidate.id === comment.id ? comment : candidate)),
        };
      }),
    })),
  };
}

export function applyCommentDeleted(board: BoardDetails, commentId: string): BoardDetails {
  return {
    ...board,
    columns: board.columns.map((column) => ({
      ...column,
      cards: column.cards.map((card) => ({
        ...card,
        comments: card.comments.filter((comment) => comment.id !== commentId),
      })),
    })),
  };
}
