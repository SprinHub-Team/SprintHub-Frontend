import { AssigneeSelect, PrioritySelect } from './CardFieldSelects';
import { CardChecklist } from './CardChecklist';
import { useEffect, useState, type FormEvent } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Alert } from '@/components/ui/Alert/Alert';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Modal } from '@/components/ui/Modal/Modal';
import { TextArea } from '@/components/ui/TextArea/TextArea';
import { useActiveBoardStore } from '@/features/boards/store/useActiveBoardStore';
import type { BoardColumn } from '@/features/columns/types/column.types';
import type { GroupMemberDto } from '@/features/groups/types/group.dto';
import { CommentList } from '@/features/comments/components/CommentList';
import { CommentForm } from '@/features/comments/components/CommentForm';
import { useCommentMutations } from '@/features/comments/hooks/useCommentMutations';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { useCardMutations } from '../hooks/useCardMutations';
import { CardFilesSection } from './CardFilesSection';
import { UserAvatar } from './UserAvatar';
import type { CardPriority } from '../types/card.types';

export interface CardDetailsModalProps {
  cardId: string | null;
  columns: BoardColumn[];
  members: GroupMemberDto[];
  onClose: () => void;
  canDeleteCard?: boolean;
}

interface EditValues {
  title: string;
  description: string;
  priority: CardPriority;
  assignedTo: string;
  columnId: string;
  dueDate: string;
  status: 'pendiente' | 'en_progreso' | 'completada';
}

export function CardDetailsModal({ cardId, columns, members, onClose, canDeleteCard = false }: CardDetailsModalProps) {
  const card = useActiveBoardStore((state) => {
    if (!state.board) return null;
    for (const column of state.board.columns) {
      const found = column.cards.find((candidate) => candidate.id === cardId);
      if (found) return found;
    }
    return null;
  });

  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState<EditValues | null>(null);
  const { loading, uploadingFile, update, remove, addFile, removeFile } = useCardMutations();
  const commentsMutation = useCommentMutations();
  const sessionUserId = useAuthStore((state) => state.session?.user.id ?? null);

  useEffect(() => {
    if (cardId && !card) {
      onClose();
    }
  }, [cardId, card, onClose]);

  const startEditing = () => {
    if (!card) return;
    setValues({
      title: card.title,
      dueDate: card.dueDate ? new Date(card.dueDate).toLocaleDateString("en-CA") : "",
      status: card.status,
      description: card.description,
      priority: card.priority,
      assignedTo: card.assignedTo?.id ?? '',
      columnId: card.columnId,
    });
    setEditing(true);
  };

  const handleChange = (field: keyof EditValues) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setValues((current) => (current ? { ...current, [field]: event.target.value } : current));
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!card || !values) return;
    if (values.title.trim().length < 2) return;
    const succeeded = await update(
      card.id,
      card.columnId,
      values.columnId,
      {
        title: values.title.trim(),
        dueDate: values.dueDate ? new Date(values.dueDate + "T23:59:59").toISOString() : null,
        status: values.status,
        description: values.description,
        priority: values.priority,
        assignedTo: values.assignedTo,
      },
    );
    if (succeeded) {
      setEditing(false);
      setValues(null);
    }
  };

  const handleDelete = () => {
    if (!card) return;
    void remove(card.id);
  };



  return (
    <Modal
      open={cardId !== null && card !== null}
      onClose={onClose}
      title={card ? card.title : 'Tarjeta'}
      description={
        card
          ? `Columna: ${columns.find((column) => column.id === card.columnId)?.name ?? 'Sin columna'}`
          : undefined
      }
    >
      {card ? (
        <div className="flex flex-col gap-8">
          {editing && values ? (
            <form onSubmit={handleSave} noValidate className="flex flex-col gap-5">
              <Input
                label="Título"
                name="edit-title"
                required
                value={values.title}
                onChange={handleChange('title')}
                disabled={loading}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Fecha de vencimiento" type="date" name="dueDate" value={values.dueDate} onChange={handleChange('dueDate')} disabled={loading} />
                <label className="flex flex-col gap-2 text-sm">Estado
                  <select className="workspace-select" value={values.status} onChange={handleChange('status')} disabled={loading}>
                    <option value="pendiente">Pendiente</option><option value="en_progreso">En progreso</option><option value="completada">Completada</option>
                  </select>
                </label>
              </div>
              <TextArea
                label="Descripción"
                name="edit-description"
                value={values.description}
                onChange={handleChange('description')}
                disabled={loading}
              />

              <div className="grid items-start gap-4 sm:grid-cols-2">
                <PrioritySelect value={values.priority} disabled={loading}
                  onChange={priority => setValues({ ...values, priority })} />
                <AssigneeSelect members={card.assignedTo && !members.some(member => member.id === card.assignedTo?.id)
                  ? [...members, card.assignedTo] : members} value={values.assignedTo} disabled={loading}
                  onChange={assignedTo => setValues({ ...values, assignedTo })} />
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label htmlFor="edit-column" className="text-sm font-medium text-(--text-on-dark)">
                    Columna
                  </label>
                  <select
                    id="edit-column"
                    value={values.columnId}
                    onChange={handleChange('columnId')}
                    disabled={loading}
                    className="h-11 w-full rounded-(--radius-sm) border border-(--border-subtle) bg-(--ink-soft) px-3 text-sm text-(--text-on-dark) focus:border-(--sand) focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-(--sand)"
                  >
                    {columns.map((column) => (
                      <option key={column.id} value={column.id}>
                        {column.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setValues(null);
                  }}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button type="submit" loading={loading}>
                  Guardar cambios
                </Button>
              </div>
            </form>
          ) : (
            <section className="flex flex-col gap-4" aria-label="Detalles de la tarjeta">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="outline">{card.status === "completada" ? "Completada" : card.status === "en_progreso" ? "En progreso" : "Pendiente"}</Badge>
                {card.dueDate && <Badge tone="muted">Vence: {new Date(card.dueDate).toLocaleDateString()}</Badge>}
                <Badge tone={card.priority === 'alta' ? 'outline' : 'neutral'}>
                  Prioridad {card.priority}
                </Badge>
                {card.assignedTo ? (
                  <Badge
                    tone="muted"
                    icon={
                      <UserAvatar
                        profilePicture={card.assignedTo.profilePicture}
                        name={card.assignedTo.name}
                        className="size-4 text-[9px]"
                      />
                    }
                  >
                    Responsable: {card.assignedTo.name}
                  </Badge>
                ) : (
                  <Badge tone="muted">Sin responsable</Badge>
                )}
              </div>

              {card.description ? (
                <p className="text-sm leading-relaxed whitespace-pre-line text-(--text-on-dark)">
                  {card.description}
                </p>
              ) : (
                <p className="text-sm text-(--text-muted)">Esta tarjeta no tiene descripción.</p>
              )}

              <div className="flex flex-wrap justify-end gap-2 pt-2">
                <Button size="sm" loading={loading} onClick={() => void update(card.id, card.columnId, card.columnId, { status: card.status === 'completada' ? 'pendiente' : 'completada' })}>
                  {card.status === 'completada' ? 'Reabrir tarea' : 'Marcar como completada'}
                </Button>
                {canDeleteCard ? (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleDelete}
                    loading={loading}
                    icon={<Trash2 aria-hidden="true" className="size-4" />}
                  >
                    Eliminar tarjeta
                  </Button>
                ) : null}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={startEditing}
                  icon={<Pencil aria-hidden="true" className="size-4" />}
                >
                  Editar
                </Button>
              </div>
            </section>
          )}

          <CardChecklist key={card.id} card={card} />

          <section className="flex flex-col gap-4 border-t border-(--border-subtle) pt-6" aria-label="Comentarios">
            <h3 className="text-sm font-semibold text-(--text-on-dark)">
              Comentarios ({card.comments.length})
            </h3>
            <CommentList
              comments={card.comments}
              sessionUserId={sessionUserId ?? ''}
              onDelete={(commentId) => void commentsMutation.remove(commentId)}
              deleting={commentsMutation.loading}
            />
            {sessionUserId ? (
              <CommentForm cardId={card.id} />
            ) : (
              <Alert variant="info" title="Inicia sesión para comentar" />
            )}
          </section>

          <CardFilesSection
            cardId={card.id}
            files={card.files}
            uploading={uploadingFile}
            removing={loading}
            onAddFile={(file) => addFile(card.id, file)}
            onRemoveFile={(filePath) => removeFile(card.id, filePath)}
          />
        </div>
      ) : null}
    </Modal>
  );
}
