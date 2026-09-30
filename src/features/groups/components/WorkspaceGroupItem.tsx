import { ChevronDown, ChevronRight, FileText, Pencil, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GroupDetails } from '../types/group.types';

export interface WorkspaceGroupItemProps {
  group: GroupDetails;
  expanded: boolean;
  selected: boolean;
  onToggle: () => void;
  onOpenMembers: () => void;
  onOpenDocuments: () => void;
  onEdit: () => void;
  children?: React.ReactNode;
}

export function WorkspaceGroupItem({
  group,
  expanded,
  selected,
  onToggle,
  onOpenMembers,
  onOpenDocuments,
  onEdit,
  children,
}: WorkspaceGroupItemProps) {
  return (
    <li className="flex flex-col">
      <div
        className={cn(
          'flex items-center gap-1 rounded-(--radius-sm) transition-colors duration-200 ease-out',
          selected ? 'bg-(--ink-raised)' : 'hover:bg-(--ink-raised)/60',
        )}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className="flex min-w-0 flex-1 items-center gap-2 px-2 py-2.5 text-left"
        >
          {expanded ? (
            <ChevronDown aria-hidden="true" className="size-4 shrink-0 text-(--taupe)" />
          ) : (
            <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-(--taupe)" />
          )}
          <span
            aria-hidden="true"
            className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-(--radius-xs) border border-(--border-subtle) bg-(--gradient-sand-soft) text-[10px] font-bold text-(--brown)"
          >
            {group.profilePicture ? (
              <img src={group.profilePicture} alt="" className="size-full object-cover" />
            ) : (
              group.name.slice(0, 2).toUpperCase()
            )}
          </span>
          <span
            className={cn(
              'truncate text-sm font-medium',
              selected ? 'text-(--cream)' : 'text-(--text-on-dark)',
            )}
          >
            {group.name}
          </span>
        </button>
        <button
          type="button"
          onClick={onOpenDocuments}
          title="Documentos del proyecto"
          aria-label={`Documentos de ${group.name}`}
          className="mr-0.5 flex shrink-0 items-center gap-1 rounded-full border border-(--border-subtle) px-2 py-0.5 text-xs text-(--text-muted) transition-colors duration-200 ease-out hover:border-(--border-dark) hover:text-(--cream)"
        >
          <FileText aria-hidden="true" className="size-3" />
        </button>
        <button
          type="button"
          onClick={onOpenMembers}
          title="Ver miembros del grupo"
          aria-label={`Miembros de ${group.name} (${group.members.length})`}
          className="mr-0.5 flex shrink-0 items-center gap-1 rounded-full border border-(--border-subtle) px-2 py-0.5 text-xs text-(--text-muted) transition-colors duration-200 ease-out hover:border-(--border-dark) hover:text-(--cream)"
        >
          <Users aria-hidden="true" className="size-3" />
          {group.members.length}
        </button>
        <button
          type="button"
          onClick={onEdit}
          title="Editar grupo"
          aria-label={`Editar ${group.name}`}
          className="mr-1 flex shrink-0 items-center rounded-(--radius-sm) p-1 text-(--taupe) transition-colors duration-200 ease-out hover:bg-(--ink-soft) hover:text-(--cream)"
        >
          <Pencil aria-hidden="true" className="size-3" />
        </button>
      </div>

      {expanded ? (
        <div className="mt-1 ml-4 flex flex-col gap-1 border-l border-(--border-subtle) pl-3">
          {children}
        </div>
      ) : null}
    </li>
  );
}
