import { useCallback, useState, type FormEvent } from 'react';
import { Lock, UserPlus, Users } from 'lucide-react';
import { Alert } from '@/components/ui/Alert/Alert';
import { Badge } from '@/components/ui/Badge/Badge';
import { Button } from '@/components/ui/Button/Button';
import { Input } from '@/components/ui/Input/Input';
import { Modal } from '@/components/ui/Modal/Modal';
import { useAuth } from '@/features/auth';
import type { GroupDetails, GroupMemberRole } from '../types/group.types';
import { useAddGroupMember } from '../hooks/useAddGroupMember';
import { useRemoveGroupMember, useUpdateGroupMemberRole } from '../hooks/useGroupMutations';
import styles from './GroupMembersModal.module.css';

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
  const { user } = useAuth();
  const sessionUserId = user?.id ?? null;

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
      <div className={styles.body}>
        {canManageMembers && addMember.error && !addMember.error.hasValidationIssues ? (
          <Alert variant="danger" title="No se pudo añadir el miembro">
            {addMember.error.message}
          </Alert>
        ) : null}

        {canManageMembers ? (
        <form onSubmit={handleInvite} noValidate className={styles.inviteForm}>
          <div className={styles.inviteFields}>
            <div className={styles.inviteEmail}>
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
            <div className={styles.inviteRole}>
              <label htmlFor="member-role" className={styles.roleLabel}>
                Rol
              </label>
              <select
                id="member-role"
                name="role"
                className="field-select"
                value={role}
                onChange={(event) => setRole(event.target.value as GroupMemberRole)}
                disabled={addMember.loading}
              >
                <option value="collaborator">Colaborador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>
          <Button
            type="submit"
            loading={addMember.loading}
            icon={<UserPlus aria-hidden="true" className="icon-md" />}
            className={styles.inviteSubmit}
          >
            Añadir al grupo
          </Button>
        </form>
        ) : null}

        <div className={styles.membersSection}>
          <h3 className={styles.membersTitle}>
            <Users aria-hidden="true" className={styles.membersTitleIcon} />
            Miembros actuales ({group?.members.length ?? 0})
          </h3>
          <ul className={styles.memberList}>
            {(group?.members ?? []).map((member) => {
              const isSelf = member.id === sessionUserId;
              return (
              <li key={member.id} className={styles.memberRow}>
                <div className={styles.memberInfo}>
                  <span className={styles.memberName}>
                    {member.name}
                    {isSelf ? (
                      <span className={styles.memberSelf}>(tú)</span>
                    ) : null}
                  </span>
                  <span className={styles.memberEmail}>{member.email}</span>
                </div>
                <div className={styles.memberActions}>
                  {canManageMembers ? (
                    <span className={styles.roleControls}>
                      {isSelf ? (
                        <span title="No puedes cambiar tu propio rol" className={styles.roleLock}>
                          <Lock aria-hidden="true" className={styles.roleLockIcon} />
                        </span>
                      ) : null}
                      <select
                        value={member.role}
                        onChange={(event) => handleRoleChange(member.id, event.target.value as GroupMemberRole)}
                        disabled={updateRole.loading || isSelf}
                        aria-label={isSelf ? 'Tu rol en el grupo' : `Rol de ${member.name}`}
                        title={isSelf ? 'No puedes cambiar tu propio rol' : 'Cambiar rol del miembro'}
                        className={styles.roleSelect}
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
                      className={styles.removeButton}
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
