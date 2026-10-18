import { useEffect, useState, type FormEvent } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Modal } from '@/components/ui/Modal/Modal';
import { TextArea } from '@/components/ui/TextArea/TextArea';
import { useActiveBoardStore } from '@/features/boards/store/useActiveBoardStore';
import type { BoardColumn } from '@/features/columns/types/column.types';
import type { GroupMemberDto } from '@/features/groups/types/group.dto';
import { useCardMutations } from '../hooks/useCardMutations';
import { UserAvatar } from './UserAvatar';
import type { CardPriority } from '../types/card.types';
import styles from './CardDetailsModal.module.css';

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
  const { loading, update, remove } = useCardMutations();

  useEffect(() => {
    if (cardId && !card) {
      onClose();
    }
  }, [cardId, card, onClose]);

  const startEditing = () => {
    if (!card) return;
    setValues({
      title: card.title,
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

  const canUnassign = (card?.assignedTo ?? null) === null;

  return (
    <Modal
      open={cardId !== null && card !== null}
      onClose={onClose}
      title={card ? card.title : 'Tarjeta'}
      description={
        card
          ? `En ${columns.find((column) => column.id === card.columnId)?.name ?? 'el tablero'}`
          : undefined
      }
    >
      {card ? (
        <div className={styles.body}>
          {editing && values ? (
            <form onSubmit={handleSave} noValidate className={styles.form}>
              <Input
                label="Título"
                name="edit-title"
                required
                value={values.title}
                onChange={handleChange('title')}
                disabled={loading}
              />

              <TextArea
                label="Descripción"
                name="edit-description"
                value={values.description}
                onChange={handleChange('description')}
                disabled={loading}
              />

              <div className={styles.fieldsGrid}>
                <div className={styles.field}>
                  <label htmlFor="edit-priority" className={styles.fieldLabel}>
                    Prioridad
                  </label>
                  <select
                    id="edit-priority"
                    className="field-select"
                    value={values.priority}
                    onChange={handleChange('priority')}
                    disabled={loading}
                  >
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>

                <div className={styles.field}>
                  <label htmlFor="edit-assigned" className={styles.fieldLabel}>
                    Responsable
                  </label>
                  <select
                    id="edit-assigned"
                    className="field-select"
                    value={values.assignedTo}
                    onChange={handleChange('assignedTo')}
                    disabled={loading}
                  >
                    {canUnassign ? <option value="">Sin asignar</option> : null}
                    {members.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                  {!canUnassign ? (
                    <p className={styles.fieldHint}>
                      El contrato actual no permite desasignar: elige otro responsable.
                    </p>
                  ) : null}
                </div>

                <div className={styles.field}>
                  <label htmlFor="edit-column" className={styles.fieldLabel}>
                    Columna
                  </label>
                  <select
                    id="edit-column"
                    className="field-select"
                    value={values.columnId}
                    onChange={handleChange('columnId')}
                    disabled={loading}
                  >
                    {columns.map((column) => (
                      <option key={column.id} value={column.id}>
                        {column.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.actions}>
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
            <section className={styles.details} aria-label="Detalles de la tarjeta">
              <div className={styles.badges}>
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
                        className={styles.badgeAvatar}
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
                <p className={styles.description}>{card.description}</p>
              ) : (
                <p className={styles.emptyDescription}>Esta tarjeta no tiene descripción.</p>
              )}

              <div className={styles.detailsActions}>
                {canDeleteCard ? (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleDelete}
                    loading={loading}
                    icon={<Trash2 aria-hidden="true" className="icon-md" />}
                  >
                    Eliminar tarjeta
                  </Button>
                ) : null}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={startEditing}
                  icon={<Pencil aria-hidden="true" className="icon-md" />}
                >
                  Editar
                </Button>
              </div>
            </section>
          )}
        </div>
      ) : null}
    </Modal>
  );
}
