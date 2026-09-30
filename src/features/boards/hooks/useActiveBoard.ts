import { useCallback, useEffect, useSyncExternalStore } from 'react';
import {
  joinBoard,
  leaveBoard,
  subscribeToBoardEvents,
  subscribeRealtimeStatus,
} from '@/services/socket/socketService';
import { getSocketStatus, type SocketConnectionStatus } from '@/services/socket/socketClient';
import { errorHandler } from '@/services/api/errors/errorHandler';
import { useActiveBoardStore } from '../store/useActiveBoardStore';

export function useActiveBoard(boardId: string | null) {
  const board = useActiveBoardStore((state) => state.board);
  const status = useActiveBoardStore((state) => state.status);
  const error = useActiveBoardStore((state) => state.error);

  useEffect(() => {
    const store = useActiveBoardStore.getState();

    if (!boardId) {
      store.reset();
      return undefined;
    }

    store.beginLoading(boardId);

    const unsubscribeEvents = subscribeToBoardEvents({
      onColumnCreated: (column) => useActiveBoardStore.getState().addColumn(column),
      onColumnUpdated: (column) => useActiveBoardStore.getState().changeColumn(column),
      onColumnDeleted: ({ columnId }) => useActiveBoardStore.getState().removeColumn(columnId),
      onCardCreated: (card) => useActiveBoardStore.getState().addCard(card),
      onCardUpdated: (card) => useActiveBoardStore.getState().changeCard(card),
      onCardDeleted: (cardId) => useActiveBoardStore.getState().removeCard(cardId),
      onCardFileAdded: (card) => useActiveBoardStore.getState().changeCard(card),
      onCardFileRemoved: (card) => useActiveBoardStore.getState().changeCard(card),
      onCommentCreated: (comment) => useActiveBoardStore.getState().addComment(comment),
      onCommentUpdated: (comment) => useActiveBoardStore.getState().changeComment(comment),
      onCommentDeleted: (commentId) => useActiveBoardStore.getState().removeComment(commentId),
    });

    let active = true;

    joinBoard(boardId)
      .then((board) => {
        if (active) {
          useActiveBoardStore.getState().setBoard(board);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          useActiveBoardStore.getState().setError(errorHandler(error).message);
        }
      });

    return () => {
      active = false;
      unsubscribeEvents();
      leaveBoard(boardId);
      useActiveBoardStore.getState().reset();
    };
  }, [boardId]);

  return { board, status, error };
}

export function useRealtimeStatus(): SocketConnectionStatus {
  const subscribe = useCallback(
    (onStoreChange: () => void) => subscribeRealtimeStatus(() => onStoreChange()),
    [],
  );
  return useSyncExternalStore(subscribe, getSocketStatus, () => 'disconnected');
}
