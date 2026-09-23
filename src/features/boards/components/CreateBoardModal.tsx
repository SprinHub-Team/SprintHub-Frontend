import { useState, useEffect } from 'react';
import { useBoards } from '../hooks/useBoards';
import * as boardService from '../services/boardService';
import { createBoardSchema, type CreateBoardFormData } from '../types/board.schema';
import { ApiError } from '@/services/api/errors/ApiError';
import Modal from '@/components/common/ui/Modal';
import Input from '@/components/common/ui/Input';
import Button from '@/components/common/ui/Button';
import Alert from '@/components/common/ui/Alert';
import { templateService, type BoardTemplate } from '@/features/templates/services/templateService';

interface CreateBoardModalProps {
    isOpen: boolean;
    onClose: () => void;
    groupId: string;
}

export function CreateBoardModal({ isOpen, onClose, groupId }: CreateBoardModalProps) {
    const { addBoard } = useBoards(groupId); 
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Partial<Record<keyof CreateBoardFormData, string>>>({});
    
    const [formData, setFormData] = useState<CreateBoardFormData>({
        title: '',
        description: '',
        groupId: groupId
    });

    const [templates, setTemplates] = useState<BoardTemplate[]>([]);
    const [selectedTemplateId, setSelectedTemplateId] = useState('');

    useEffect(() => {
        if (isOpen) {
            templateService.getAllTemplates().then(setTemplates).catch(console.error);
        }
    }, [isOpen]);

    const handleChange = (field: keyof CreateBoardFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: undefined }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setErrors({});

        const validation = createBoardSchema.safeParse(formData);

        if (!validation.success) {
            const fieldErrors: Partial<Record<keyof CreateBoardFormData, string>> = {};
            for (const issue of validation.error.issues) {
                const field = issue.path[0] as keyof CreateBoardFormData;
                fieldErrors[field] = issue.message;
            }
            setErrors(fieldErrors);
            return;
        }

        setIsLoading(true);
        try {
            const newBoard = await boardService.createBoard(validation.data);
            
            if (selectedTemplateId) {
                await templateService.applyTemplate(newBoard.id, selectedTemplateId);
                // Refresh board or something? No, the newBoard from backend might not have the columns instantly if we don't refetch, but typically addBoard just adds to the list.
            }

            addBoard(newBoard);
            onClose();
            setFormData({ title: '', description: '', groupId: groupId });
            setSelectedTemplateId('');
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError('Error inesperado al crear el tablero');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Tablero">
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Input
                    id="title"
                    label="Nombre del tablero"
                    placeholder="Ej. Sprint 1, Proyecto X"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    error={errors.title}
                    disabled={isLoading}
                />

                <Input
                    id="description"
                    label="Descripción (opcional)"
                    placeholder="Breve descripción"
                    value={formData.description || ''}
                    onChange={(e) => handleChange('description', e.target.value)}
                    error={errors.description}
                    disabled={isLoading}
                />

                <div>
                    <label className="block text-sm font-medium mb-1 dark:text-slate-300" style={{ color: "var(--text)" }}>Plantilla de columnas (Opcional)</label>
                    <select
                        className="w-full p-2 border rounded-md dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                        style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)" }}
                        value={selectedTemplateId}
                        onChange={(e) => setSelectedTemplateId(e.target.value)}
                        disabled={isLoading}
                    >
                        <option value="">-- Ninguna (Vacío) --</option>
                        {templates.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        disabled={isLoading}
                        className="dark:text-slate-300"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                    >
                        Crear Tablero
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
