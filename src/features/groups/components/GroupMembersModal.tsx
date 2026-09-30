import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Trash2, UserPlus, Users } from 'lucide-react';
import { Alert } from '@/components/ui/Alert/Alert';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Modal } from '@/components/ui/Modal/Modal';
import type { GroupDetails, GroupMemberRole } from '../types/group.types';
import { useAddGroupMember } from '../hooks/useAddGroupMember';
import { useDeleteGroup, useRemoveGroupMember } from '../hooks/useGroupMutations';

export interface GroupMembersModalProps {
  open: boolean;
  onClose: () => void;
  group: GroupDetails | null;
  canDeleteGroup?: boolean;
  onDeleteGroup?: (groupId: string) => void;
}

const ROLE_LABELS: Record<GroupMemberRole, string> = {
  admin: 'Administrador',
  collaborator: 'Colaborador',
};

export function GroupMembersModal({
  open,
  onClose,
  group,
  canDeleteGroup = false,
  onDeleteGroup,
}: GroupMembersModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<GroupMemberRole>('collaborator');
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const addMember = useAddGroupMember();
  const removeMember = useRemoveGroupMember();
  const deleteGroup = useDeleteGroup();

  useEffect(() => {
    if (!confirmingDelete) return undefined;
    const timer = setTimeout(() => setConfirmingDelete(false), 3500);
    return () => clearTimeout(timer);
  }, [confirmingDelete]);

  const handleClose = useCallback(() => {
  setConfirmingDelete(false);
  setEmail('');
  onClose();
  }, [onClose]);

  const fieldErrors: Record<string, string> =
    addMember.error?.hasValidationIssues === true
      ? Object.fromEntries(addMember.error.issues.map((issue) => [issue.path, issue.message]))
      : {};

  const handleInvite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!group) return;
    const succeeded = await addMember.submit(group.id, { email, role });
    if (succeeded) {
      setEmail('');
    }
  };

  const handleDeleteGroup = () => {
    if (!group) return;
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    void deleteGroup.submit(group.id).then((succeeded) => {
      if (succeeded) {
        onDeleteGroup?.(group.id);
        handleClose();
      }
    });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={group ? `Miembros de ${group.name}` : 'Miembros del grupo'}
      description="Invita por correo y elige el rol que tendrá cada persona."
    >
      <div className="flex flex-col gap-6">
        {addMember.error && !addMember.error.hasValidationIssues ? (
          <Alert variant="danger" title="No se pudo añadir el miembro">
            {addMember.error.message}
          </Alert>
        ) : null}

        <form onSubmit={handleInvite} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex-1">
              <Input
                label="Correo del nuevo miembro"
                type="email"
                name="member-email"
                placeholder="compañero@equipo.com"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                error={fieldErrors.email}
                disabled={addMember.loading}
              />
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-44">
              <label htmlFor="member-role" className="text-sm font-medium text-(--text-on-dark)">
                Rol
              </label>
              <select
                id="member-role"
                name="role"
                value={role}
                onChange={(event) => setRole(event.target.value as GroupMemberRole)}
                disabled={addMember.loading}
                className="h-11 w-full rounded-(--radius-sm) border border-(--border-subtle) bg-(--ink-soft) px-3 text-sm text-(--text-on-dark) transition-colors duration-200 ease-out hover:border-(--border-dark) focus:border-(--sand) focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-(--sand)"
              >
                <option value="collaborator">Colaborador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>
          <Button
            type="submit"
            loading={addMember.loading}
            icon={<UserPlus aria-hidden="true" className="size-4" />}
            className="self-start"
          >
            Añadir al grupo
          </Button>
        </form>

        <div className="flex flex-col gap-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-(--text-on-dark)">
            <Users aria-hidden="true" className="size-4 text-(--sand)" />
            Miembros actuales ({group?.members.length ?? 0})
          </h3>
          <ul className="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1">
            {(group?.members ?? []).map((member) => (
              <li
                key={member.id}
                className="flex items-center justify-between gap-3 rounded-(--radius-sm) border border-(--border-subtle) bg-(--ink-soft) px-4 py-3"
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium text-(--text-on-dark)">
                    {member.name}
                  </span>
                  <span className="truncate text-xs text-(--text-muted)">{member.email}</span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge tone={member.role === 'admin' ? 'outline' : 'neutral'}>
                    {ROLE_LABELS[member.role]}
                  </Badge>
                  <button
                    type="button"
                    onClick={() => group && removeMember.submit(group.id, member.id)}
                    disabled={removeMember.loading}
                    className="rounded-(--radius-sm) px-2 py-1 text-xs text-(--text-muted) transition-colors duration-200 ease-out hover:text-(--cream) disabled:opacity-50"
                  >
                    Retirar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {canDeleteGroup && onDeleteGroup ? (
          <div className="flex flex-col gap-2 border-t border-(--border-subtle) pt-4">
            <Button
              variant={confirmingDelete ? 'danger' : 'ghost'}
              size="sm"
              loading={deleteGroup.loading}
              onClick={handleDeleteGroup}
              icon={<Trash2 aria-hidden="true" className="size-4" />}
              className={confirmingDelete ? undefined : 'self-start text-(--taupe) hover:text-(--cream)'}
            >
              {confirmingDelete ? 'Confirmar eliminación del grupo' : 'Eliminar grupo'}
            </Button>
            {confirmingDelete ? (
              <p className="text-xs text-(--text-muted)">
                Se eliminarán también sus tableros, columnas y tarjetas.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
