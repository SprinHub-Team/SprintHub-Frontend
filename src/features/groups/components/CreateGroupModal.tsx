import { useState } from 'react';
import { useGroupStore } from '../store/groupStore';
import * as groupService from '../services/groupService';
import { createGroupSchema, type CreateGroupFormData } from '../types/group.schema';
import { ApiError } from '@/services/api/errors/ApiError';
import Modal from '@/components/common/ui/Modal';
import Input from '@/components/common/ui/Input';
import Button from '@/components/common/ui/Button';
import Alert from '@/components/common/ui/Alert';

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateGroupModal({ isOpen, onClose }: CreateGroupModalProps) {
    const { addGroup } = useGroupStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Partial<Record<keyof CreateGroupFormData, string>>>({});
    
    const [formData, setFormData] = useState<CreateGroupFormData>({
        name: '',
        description: '',
        visibility: 'private'
    });

    const handleChange = (field: keyof CreateGroupFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: undefined }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setErrors({});

        const validation = createGroupSchema.safeParse(formData);

        if (!validation.success) {
            const fieldErrors: Partial<Record<keyof CreateGroupFormData, string>> = {};
            for (const issue of validation.error.issues) {
                const field = issue.path[0] as keyof CreateGroupFormData;
                fieldErrors[field] = issue.message;
            }
            setErrors(fieldErrors);
            return;
        }

        setIsLoading(true);
        try {
            const newGroup = await groupService.createGroup(validation.data);
            addGroup(newGroup);
            onClose();
            setFormData({ name: '', description: '', visibility: 'private' });
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('No fue posible crear el grupo.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Grupo">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Input
                    id="name"
                    label="Nombre del grupo"
                    placeholder="Ej. Equipo de Desarrollo"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    error={errors.name}
                    disabled={isLoading}
                />

                <Input
                    id="description"
                    label="Descripción (opcional)"
                    placeholder="Breve descripción del propósito del grupo"
                    value={formData.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    error={errors.description}
                    disabled={isLoading}
                />

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-[var(--text)]">
                        Visibilidad
                    </label>
                    <select
                        className={`w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]`}
                        value={formData.visibility}
                        onChange={(e) => handleChange('visibility', e.target.value as 'private' | 'public')}
                        disabled={isLoading}
                    >
                        <option value="private">Privado (solo miembros invitados)</option>
                        <option value="public">Público (cualquiera en la organización)</option>
                    </select>
                </div>

                <div className="pt-4 flex gap-3 justify-end">
                    <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        Crear Grupo
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
