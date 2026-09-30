import { create } from 'zustand';
import type { BoardDetails } from '../types/board.types';
import type { Card } from '@/features/cards/types/card.types';
import type { BoardColumn } from '@/features/columns/types/column.types';
import type { Comment } from '@/features/comments/types/comment.types';
import {
  applyCardCreated,
  applyCardDeleted,
  applyCardUpdated,
  applyColumnCreated,
  applyColumnDeleted,
  applyColumnUpdated,
  applyCommentCreated,
  applyCommentDeleted,
  applyCommentUpdated,
} from '../services/boardEvents';

export type ActiveBoardStatus = 'idle' | 'loading' | 'success' | 'error';

interface ActiveBoardState {
  boardId: string | null;
  board: BoardDetails | null;
  status: ActiveBoardStatus;
  error: string | null;

  beginLoading: (boardId: string) => void;
  setBoard: (board: BoardDetails) => void;
  setError: (message: string) => void;
  reset: () => void;

  addColumn: (column: BoardColumn) => void;
  changeColumn: (column: BoardColumn) => void;
  removeColumn: (columnId: string) => void;
  addCard: (card: Card) => void;
  changeCard: (card: Card) => void;
  removeCard: (cardId: string) => void;
  addComment: (comment: Comment) => void;
  changeComment: (comment: Comment) => void;
  removeComment: (commentId: string) => void;
}

export const useActiveBoardStore = create<ActiveBoardState>((set, get) => ({
  boardId: null,
  board: null,
  status: 'idle',
  error: null,

  beginLoading: (boardId) => set({ boardId, board: null, status: 'loading', error: null }),

  setBoard: (board) => {
    const currentId = get().boardId;
    if (currentId !== null && currentId !== board.id) return;
    set({ board, status: 'success', error: null });
  },

  setError: (message) => set({ board: null, status: 'error', error: message }),

  reset: () => set({ boardId: null, board: null, status: 'idle', error: null }),

  addColumn: (column) => {
    const { board } = get();
    if (!board) return;
    set({ board: applyColumnCreated(board, column) });
  },

  changeColumn: (column) => {
    const { board } = get();
    if (!board) return;
    set({ board: applyColumnUpdated(board, column) });
  },

  removeColumn: (columnId) => {
    const { board } = get();
    if (!board) return;
    set({ board: applyColumnDeleted(board, columnId) });
  },

  addCard: (card) => {
    const { board } = get();
    if (!board) return;
    set({ board: applyCardCreated(board, card) });
  },

  changeCard: (card) => {
    const { board } = get();
    if (!board) return;
    set({ board: applyCardUpdated(board, card) });
  },

  removeCard: (cardId) => {
    const { board } = get();
    if (!board) return;
    set({ board: applyCardDeleted(board, cardId) });
  },

  addComment: (comment) => {
    const { board } = get();
    if (!board) return;
    set({ board: applyCommentCreated(board, comment) });
  },

  changeComment: (comment) => {
    const { board } = get();
    if (!board) return;
    set({ board: applyCommentUpdated(board, comment) });
  },

  removeComment: (commentId) => {
    const { board } = get();
    if (!board) return;
    set({ board: applyCommentDeleted(board, commentId) });
  },
}));
