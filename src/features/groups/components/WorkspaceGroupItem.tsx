import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Pencil, Trash2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GroupDetails } from '../types/group.types';
import styles from './WorkspaceGroupItem.module.css';

export interface WorkspaceGroupItemProps {
  group: GroupDetails;
  expanded: boolean;
  selected: boolean;
  onToggle: () => void;
  onOpenMembers: () => void;
  onEdit: () => void;
  canEditGroup?: boolean;
  canDeleteGroup?: boolean;
  onDeleteGroup?: () => void;
  deletingGroup?: boolean;
  children?: React.ReactNode;
}

export function WorkspaceGroupItem({
  group,
  expanded,
  selected,
  onToggle,
  onOpenMembers,
  onEdit,
  canEditGroup = false,
  canDeleteGroup = false,
  onDeleteGroup,
  deletingGroup = false,
  children,
}: WorkspaceGroupItemProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (!confirmingDelete) return undefined;
    const timer = setTimeout(() => setConfirmingDelete(false), 3500);
    return () => clearTimeout(timer);
  }, [confirmingDelete]);

  const handleDeleteClick = () => {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    setConfirmingDelete(false);
    onDeleteGroup?.();
  };

  return (
    <li className={styles.item}>
      <div className={cn(styles.row, selected ? styles.rowSelected : styles.rowIdle)}>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          className={styles.toggle}
        >
          {expanded ? (
            <ChevronDown aria-hidden="true" className={cn('icon-md', styles.chevron)} />
          ) : (
            <ChevronRight aria-hidden="true" className={cn('icon-md', styles.chevron)} />
          )}
          <span aria-hidden="true" className={styles.avatar}>
            {group.profilePicture ? (
              <img src={group.profilePicture} alt="" className={styles.avatarImage} />
            ) : (
              group.name.slice(0, 2).toUpperCase()
            )}
          </span>
          <span
            className={cn(
              styles.name,
              selected ? styles.nameSelected : styles.nameIdle,
            )}
          >
            {group.name}
          </span>
        </button>
        <button
          type="button"
          onClick={onOpenMembers}
          title="Ver miembros del grupo"
          aria-label={`Miembros de ${group.name} (${group.members.length})`}
          className={styles.pill}
        >
          <Users aria-hidden="true" className={styles.pillIcon} />
          {group.members.length}
        </button>
        {canEditGroup ? (
          <button
            type="button"
            onClick={onEdit}
            title="Editar grupo"
            aria-label={`Editar ${group.name}`}
            className={styles.iconButton}
          >
            <Pencil aria-hidden="true" className={styles.pillIcon} />
          </button>
        ) : null}
        {canDeleteGroup && onDeleteGroup ? (
          <button
            type="button"
            onClick={handleDeleteClick}
            disabled={deletingGroup}
            title={
              confirmingDelete
                ? 'Confirmar eliminación: se borrarán sus tableros, columnas y tarjetas'
                : 'Eliminar grupo'
            }
            aria-label={`Eliminar ${group.name}`}
            className={cn(
              styles.iconButton,
              confirmingDelete ? styles.confirmButton : undefined,
            )}
          >
            <Trash2 aria-hidden="true" className={styles.pillIcon} />
            {confirmingDelete ? 'Confirmar' : null}
          </button>
        ) : null}
      </div>

      {expanded ? (
        <div className={styles.children}>
          {children}
        </div>
      ) : null}
    </li>
  );
}
