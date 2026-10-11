import { useCallback, useState, type FormEvent } from 'react';
import { Lock, UserPlus, Users } from 'lucide-react';
import { Alert } from '@/components/ui/Alert/Alert';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Modal } from '@/components/ui/Modal/Modal';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import type { GroupDetails, GroupMemberRole } from '../types/group.types';
import { useAddGroupMember } from '../hooks/useAddGroupMember';
import { useRemoveGroupMember, useUpdateGroupMemberRole } from '../hooks/useGroupMutations';

export interface GroupMembersModalProps {
  open: boolean;
  onClose: () => void;
  group: GroupDetails | null;
}

const ROLE_LABELS: Record<GroupMemberRole, string> = {
  admin: 'Administrador',
  collaborator: 'Colaborador',
};

export function GroupMembersModal({ open, onClose, group }: GroupMembersModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<GroupMemberRole>('collaborator');
  const addMember = useAddGroupMember();
  const removeMember = useRemoveGroupMember();
  const updateRole = useUpdateGroupMemberRole();
  const sessionUserId = useAuthStore((state) => state.session?.user.id ?? null);

  const sessionMember = group?.members.find((member) => member.id === sessionUserId) ?? null;
  const canManageMembers = sessionMember?.role === 'admin';

  const handleClose = useCallback(() => {
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

  const handleRoleChange = (memberId: string, nextRole: GroupMemberRole) => {
    if (!group) return;
    if (memberId === sessionUserId) return;
    void updateRole.submit(group.id, memberId, nextRole);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={group ? `Miembros de ${group.name}` : 'Miembros del grupo'}
      description={
        canManageMembers
          ? 'Invita por correo y elige el rol que tendrá cada persona.'
          : 'Consulta las personas del grupo y sus roles.'
      }
    >
      <div className="flex flex-col gap-6">
        {canManageMembers && addMember.error && !addMember.error.hasValidationIssues ? (
          <Alert variant="danger" title="No se pudo añadir el miembro">
            {addMember.error.message}
          </Alert>
        ) : null}

        {canManageMembers ? (
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
        ) : null}

        <div className="flex flex-col gap-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-(--text-on-dark)">
            <Users aria-hidden="true" className="size-4 text-(--sand)" />
            Miembros actuales ({group?.members.length ?? 0})
          </h3>
          <ul className="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1">
            {(group?.members ?? []).map((member) => {
              const isSelf = member.id === sessionUserId;
              return (
              <li
                key={member.id}
                className="flex items-center justify-between gap-3 rounded-(--radius-sm) border border-(--border-subtle) bg-(--ink-soft) px-4 py-3"
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="truncate text-sm font-medium text-(--text-on-dark)">
                    {member.name}
                    {isSelf ? (
                      <span className="ml-1.5 text-xs font-normal text-(--sand)">(tú)</span>
                    ) : null}
                  </span>
                  <span className="truncate text-xs text-(--text-muted)">{member.email}</span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {canManageMembers ? (
                    <span className="flex items-center gap-1.5">
                      {isSelf ? (
                        <span title="No puedes cambiar tu propio rol" className="flex shrink-0">
                          <Lock aria-hidden="true" className="size-3.5 text-(--taupe)" />
                        </span>
                      ) : null}
                      <select
                        value={member.role}
                        onChange={(event) => handleRoleChange(member.id, event.target.value as GroupMemberRole)}
                        disabled={updateRole.loading || isSelf}
                        aria-label={isSelf ? 'Tu rol en el grupo' : `Rol de ${member.name}`}
                        title={isSelf ? 'No puedes cambiar tu propio rol' : 'Cambiar rol del miembro'}
                        className="h-8 cursor-pointer rounded-(--radius-sm) border border-(--border-subtle) bg-(--ink-raised) px-2 text-xs text-(--text-on-dark) transition-colors duration-200 ease-out hover:border-(--border-dark) focus:border-(--sand) focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-(--sand) disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value="collaborator">Colaborador</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </span>
                  ) : (
                    <Badge tone={member.role === 'admin' ? 'outline' : 'neutral'}>
                      {ROLE_LABELS[member.role]}
                    </Badge>
                  )}
                  {canManageMembers && !isSelf ? (
                    <button
                      type="button"
                      onClick={() => group && removeMember.submit(group.id, member.id)}
                      disabled={removeMember.loading}
                      className="rounded-(--radius-sm) px-2 py-1 text-xs text-(--text-muted) transition-colors duration-200 ease-out hover:text-(--cream) disabled:opacity-50"
                    >
                      Retirar
                    </button>
                  ) : null}
                </div>
              </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Modal>
  );
}
