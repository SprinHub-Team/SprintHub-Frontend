import { useState } from 'react';
import { useGroupStore } from '../store/groupStore';
import * as groupService from '../services/groupService';
import { ApiError } from '@/services/api/errors/ApiError';
import Modal from '@/components/common/ui/Modal';
import Input from '@/components/common/ui/Input';
import Button from '@/components/common/ui/Button';
import Alert from '@/components/common/ui/Alert';

interface AddMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupId: string;
}

export function AddMemberModal({ isOpen, onClose, groupId }: AddMemberModalProps) {
    const { activeGroup, setActiveGroup } = useGroupStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'admin' | 'collaborator' | 'visitor'>('collaborator');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email) {
            setError('El correo electrónico es obligatorio');
            return;
        }

        setIsLoading(true);
        try {
            // El backend usa un endpoint para agregar miembros
            // Necesitamos añadir este método a groupService
            const updatedGroup = await groupService.addMember(groupId, { email, role });
            setActiveGroup(updatedGroup);
            onClose();
            setEmail('');
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('No fue posible invitar al usuario.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Invitar Miembro">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Input
                    id="email"
                    type="email"
                    label="Correo del usuario"
                    placeholder="usuario@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                />

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-[var(--text)]">
                        Rol
                    </label>
                    <select
                        className={`w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]`}
                        value={role}
                        onChange={(e) => setRole(e.target.value as 'admin' | 'collaborator' | 'visitor')}
                        disabled={isLoading}
                    >
                        <option value="admin">Administrador</option>
                        <option value="collaborator">Colaborador</option>
                        <option value="visitor">Visitante</option>
                    </select>
                </div>

                <div className="pt-4 flex gap-3 justify-end">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        Invitar
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
