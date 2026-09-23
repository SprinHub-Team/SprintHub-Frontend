import { useState, useEffect } from 'react';
import { useBoardDetailStore, type Card } from '../store/boardDetailStore';
import { socketClient } from '@/services/socket/socketClient';
import Modal from '@/components/common/ui/Modal';
import Input from '@/components/common/ui/Input';
import Button from '@/components/common/ui/Button';

interface EditCardModalProps {
    card: Card | null;
    isOpen: boolean;
    onClose: () => void;
}

export function EditCardModal({ card, isOpen, onClose }: EditCardModalProps) {
    const { updateCard } = useBoardDetailStore();
    const [formData, setFormData] = useState<Partial<Card>>({});
    const [newTaskTitle, setNewTaskTitle] = useState('');

    useEffect(() => {
        if (card) {
            setFormData({
                title: card.title,
                description: card.description || '',
                priority: card.priority,
                dueDate: card.dueDate ? new Date(card.dueDate).toISOString().slice(0, 10) : '',
                tasks: card.tasks || [],
            });
        }
    }, [card]);

    const handleChange = (field: keyof Card, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAddTask = () => {
        if (!newTaskTitle.trim()) return;
        const newTasks = [...(formData.tasks || []), { title: newTaskTitle, completed: false }];
        setFormData(prev => ({ ...prev, tasks: newTasks }));
        setNewTaskTitle('');
    };

    const toggleTask = (index: number) => {
        const newTasks = [...(formData.tasks || [])];
        newTasks[index].completed = !newTasks[index].completed;
        setFormData(prev => ({ ...prev, tasks: newTasks }));
    };

    const removeTask = (index: number) => {
        const newTasks = [...(formData.tasks || [])];
        newTasks.splice(index, 1);
        setFormData(prev => ({ ...prev, tasks: newTasks }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!card) return;

        const payload = { ...formData };
        if (!payload.dueDate) delete payload.dueDate; // backend doesn't like empty string for date

        const socket = socketClient.getSocket();
        if (socket) {
            socket.emit('card:update', {
                paramData: { cardId: card._id },
                cardData: payload
            }, (res: any) => {
                if (res.ok) {
                    updateCard(res.card);
                    onClose();
                } else {
                    alert('Error al actualizar: ' + res.error);
                }
            });
        }
    };

    if (!card) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Tarjeta">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    id="title"
                    label="Título"
                    value={formData.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                />

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-[var(--text)]">Descripción</label>
                    <textarea 
                        className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                        rows={3}
                        value={formData.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Añade una descripción más detallada..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-[var(--text)]">Prioridad</label>
                        <select
                            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            value={formData.priority || 'media'}
                            onChange={(e) => handleChange('priority', e.target.value)}
                        >
                            <option value="alta">Alta</option>
                            <option value="media">Media</option>
                            <option value="baja">Baja</option>
                        </select>
                    </div>
                    
                    <Input
                        id="dueDate"
                        type="date"
                        label="Fecha de Vencimiento"
                        value={formData.dueDate || ''}
                        onChange={(e) => handleChange('dueDate', e.target.value)}
                    />
                </div>

                <div className="space-y-2 pt-2">
                    <label className="block text-sm font-medium text-[var(--text)]">Lista de Tareas</label>
                    
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                        {(formData.tasks || []).map((task, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm bg-[var(--background)] p-2 rounded">
                                <input 
                                    type="checkbox" 
                                    checked={task.completed} 
                                    onChange={() => toggleTask(index)}
                                    className="rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]"
                                />
                                <span className={`flex-1 ${task.completed ? 'line-through text-[var(--text-secondary)]' : ''}`}>{task.title}</span>
                                <button type="button" onClick={() => removeTask(index)} className="text-red-400 hover:text-red-600">&times;</button>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Nueva tarea..."
                            className="flex-1 px-3 py-1.5 text-sm bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTask())}
                        />
                        <Button type="button" size="sm" variant="outline" onClick={handleAddTask}>Añadir</Button>
                    </div>
                </div>

                <div className="pt-4 flex gap-3 justify-end border-t border-[var(--border)]">
                    <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
                    <Button type="submit">Guardar Cambios</Button>
                </div>
            </form>
        </Modal>
    );
}
