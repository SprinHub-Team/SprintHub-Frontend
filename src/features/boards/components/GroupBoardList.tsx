import { Plus } from 'lucide-react';
import { LoadingState } from '@/components/ui/LoadingState/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState/ErrorState';
import { useBoards } from '../hooks/useBoards';
import { useDeleteBoard } from '../hooks/useBoardMutations';
import { BoardListItem } from './BoardListItem';

export interface GroupBoardListProps {
  groupId: string;
  selectedBoardId: string | null;
  canDeleteBoards: boolean;
  onSelectBoard: (boardId: string) => void;
  onBoardDeleted: (boardId: string) => void;
  onCreateBoard: () => void;
}

export function GroupBoardList({
  groupId,
  selectedBoardId,
  canDeleteBoards,
  onSelectBoard,
  onBoardDeleted,
  onCreateBoard,
}: GroupBoardListProps) {
  const { boards, status, error, reload } = useBoards(groupId);
  const { loading: deleting, submit: submitDelete } = useDeleteBoard();

  if (status === 'loading' && boards.length === 0) {
    return (
      <div className="py-2 pl-1">
        <LoadingState className="border-transparent bg-transparent py-4" message="Cargando tableros…" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="py-2 pl-1">
        <ErrorState
          className="border-transparent bg-transparent py-4"
          message={error ?? 'No se pudieron cargar los tableros.'}
          onRetry={reload}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5">
      {boards.map((board) => (
        <BoardListItem
          key={board.id}
          board={board}
          selected={selectedBoardId === board.id}
          onSelect={() => onSelectBoard(board.id)}
          onDelete={
            canDeleteBoards
              ? () => {
                  void submitDelete(board.id).then((succeeded) => {
                    if (succeeded) {
                      onBoardDeleted(board.id);
                    }
                  });
                }
              : undefined
          }
          deleting={deleting}
        />
      ))}

      {boards.length === 0 && status === 'success' ? (
        <p className="px-2.5 py-2 text-xs text-(--text-muted)">
          Este grupo todavía no tiene tableros.
        </p>
      ) : null}

      <button
        type="button"
        onClick={onCreateBoard}
        className="mt-1 flex h-9 items-center gap-2 rounded-(--radius-sm) px-2.5 text-sm text-(--text-muted) transition-colors duration-200 ease-out hover:bg-(--ink-raised)/60 hover:text-(--cream)"
      >
        <Plus aria-hidden="true" className="size-4" />
        Nuevo tablero
      </button>
    </div>
  );
}
