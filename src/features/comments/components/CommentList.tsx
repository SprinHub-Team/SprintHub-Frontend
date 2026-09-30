import { Trash2 } from 'lucide-react';
import type { Comment } from '../types/comment.types';

export interface CommentListProps {
  comments: Comment[];
  sessionUserId: string;
  onDelete: (commentId: string) => void;
  deleting?: boolean;
}

const dateFormatter = new Intl.DateTimeFormat('es', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export function CommentList({ comments, sessionUserId, onDelete, deleting }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="rounded-(--radius-sm) border border-dashed border-(--border-subtle) px-4 py-3 text-sm text-(--text-muted)">
        Aún no hay comentarios. Inicia la conversación.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {comments.map((comment) => (
        <li
          key={comment.id}
          className="flex flex-col gap-2 rounded-(--radius-sm) border border-(--border-subtle) bg-(--ink-soft) p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <span
                aria-hidden="true"
                className="flex size-7 shrink-0 items-center justify-center rounded-full border border-(--border-light) bg-(image:--gradient-main) text-[11px] font-bold text-(--brown)"
              >
                {comment.createdBy.name.slice(0, 2).toUpperCase()}
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-medium text-(--text-on-dark)">
                  {comment.createdBy.name}
                </span>
                <time
                  dateTime={comment.createdAt}
                  className="text-xs text-(--text-muted)"
                  title={comment.createdAt}
                >
                  {dateFormatter.format(new Date(comment.createdAt))}
                </time>
              </div>
            </div>
            {comment.createdBy.id === sessionUserId ? (
              <button
                type="button"
                onClick={() => onDelete(comment.id)}
                disabled={deleting}
                aria-label="Eliminar comentario"
                title="Eliminar comentario"
                className="shrink-0 rounded-(--radius-sm) p-1.5 text-(--taupe) transition-colors duration-200 ease-out hover:text-(--cream) disabled:opacity-50"
              >
                <Trash2 aria-hidden="true" className="size-3.5" />
              </button>
            ) : null}
          </div>
          <div className="flex flex-col gap-1 pl-9.5">
            <p className="text-sm font-medium text-(--cream)">{comment.name}</p>
            <p className="text-sm leading-relaxed whitespace-pre-line text-(--text-muted)">
              {comment.description}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
