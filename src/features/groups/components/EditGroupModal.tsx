import { useState, useEffect } from 'react';
import * as groupService from '../services/groupService';
import type { Group } from '../types/group.schema';
import { ApiError } from '@/services/api/errors/ApiError';
import Modal from '@/components/common/ui/Modal';
import Input from '@/components/common/ui/Input';
import Button from '@/components/common/ui/Button';
import Alert from '@/components/common/ui/Alert';

interface EditGroupModalProps {
    group: Group;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

export function EditGroupModal({ group, isOpen, onClose, onUpdate }: EditGroupModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        visibility: 'private' as 'private' | 'public'
    });

    useEffect(() => {
        if (group) {
            setFormData({
                name: group.name,
                description: group.description || '',
                visibility: group.visibility
            });
        }
    }, [group]);

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (formData.name.trim().length < 3) {
            setError('El nombre del grupo debe tener al menos 3 caracteres.');
            return;
        }

        setIsLoading(true);
        try {
            await groupService.updateGroup(group.id, formData);
            onUpdate();
            onClose();
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('No fue posible actualizar el grupo.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        setIsLoading(true);
        setError(null);
        
        try {
            await groupService.uploadGroupPicture(group.id, file);
            onUpdate();
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('No fue posible subir la imagen del grupo.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Configuración del Grupo">
            <div className="mb-6 flex flex-col items-center gap-3">
                <div className="relative group w-20 h-20 rounded-xl overflow-hidden bg-blue-600 text-white flex items-center justify-center text-3xl font-bold cursor-pointer shadow-sm">
                    {group.profilePicture ? (
                        <img src={group.profilePicture} alt={group.name} className="w-full h-full object-cover" />
                    ) : (
                        <span>{group.name.charAt(0).toUpperCase()}</span>
                    )}
                    <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <span className="text-xs text-white">Cambiar</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isLoading} />
                    </label>
                </div>
                <p className="text-xs text-slate-500">Haz clic para cambiar la imagen</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Input
                    id="name"
                    label="Nombre del grupo"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    disabled={isLoading}
                />

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-[var(--text)]">Descripción</label>
                    <textarea 
                        className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-[var(--text)]">Visibilidad</label>
                    <select
                        className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        value={formData.visibility}
                        onChange={(e) => handleChange('visibility', e.target.value)}
                        disabled={isLoading}
                    >
                        <option value="private">Privado (Solo miembros)</option>
                        <option value="public">Público (Visible para todos)</option>
                    </select>
                </div>

                <div className="pt-4 flex gap-3 justify-end border-t border-[var(--border)]">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        Guardar Cambios
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
