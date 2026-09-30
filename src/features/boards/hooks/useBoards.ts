import { useCallback, useEffect, useState } from 'react';
import { errorHandler } from '@/services/api/errors/errorHandler';
import { getBoardsByGroup } from '../services/boardService';
import type { Board } from '../types/board.types';

type BoardsStatus = 'idle' | 'loading' | 'success' | 'error';

interface BoardsSnapshot {
  groupId: string | null;
  boards: Board[];
  status: BoardsStatus;
  error: string | null;
}

export function useBoards(groupId: string | null) {
  const [snapshot, setSnapshot] = useState<BoardsSnapshot>({
    groupId: null,
    boards: [],
    status: 'idle',
    error: null,
  });

  useEffect(() => {
    let active = true;

    if (!groupId) {
      return undefined;
    }

    getBoardsByGroup(groupId)
      .then((boards) => {
        if (active) {
          setSnapshot({ groupId, boards, status: 'success', error: null });
        }
      })
      .catch((caught: unknown) => {
        if (active) {
          setSnapshot({ groupId, boards: [], status: 'error', error: errorHandler(caught).message });
        }
      });

    return () => {
      active = false;
    };
  }, [groupId]);

  const reload = useCallback(() => {
    if (!groupId) return Promise.resolve();
    return getBoardsByGroup(groupId)
      .then((boards) => {
        setSnapshot({ groupId, boards, status: 'success', error: null });
      })
      .catch((caught: unknown) => {
        setSnapshot({ groupId, boards: [], status: 'error', error: errorHandler(caught).message });
      });
  }, [groupId]);

  const current: BoardsSnapshot =
    snapshot.groupId === groupId
      ? snapshot
      : { groupId, boards: [], status: groupId ? 'loading' : 'idle', error: null };

  return { boards: current.boards, status: current.status, error: current.error, reload };
}
