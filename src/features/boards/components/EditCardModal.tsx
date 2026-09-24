import { useState, useEffect } from 'react';
import { useBoardDetailStore, type Card } from '../store/boardDetailStore';
import { useGroupDetail } from '@/features/groups/hooks/useGroupDetail';
import { socketClient } from '@/services/socket/socketClient';
import Modal from '@/components/common/ui/Modal';
import Button from '@/components/common/ui/Button';

interface EditCardModalProps {
    card: Card | null;
    isOpen: boolean;
    onClose: () => void;
}

export function EditCardModal({ card, isOpen, onClose }: EditCardModalProps) {
    const { updateCard, board } = useBoardDetailStore();
    const { activeGroup } = useGroupDetail(board?.groupId || '');

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
                assignedTo: (card.assignedTo && typeof card.assignedTo === 'object') ? (card.assignedTo as any).id : (card.assignedTo || ''),
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
        if (!payload.dueDate) delete payload.dueDate;
        if (!payload.assignedTo) payload.assignedTo = null as any; // to clear assignment

        const socket = socketClient.getSocket();
        if (socket) {
            socket.emit('card:update', {
                cardId: card._id,
                columnId: card.columnId,
                ...payload
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

    const tasks = formData.tasks || [];
    const completedTasks = tasks.filter(t => t.completed).length;
    const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Editar Tarjeta">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Título</label>
                    <input
                        required
                        className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                        value={formData.title || ''}
                        onChange={(e) => handleChange('title', e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descripción</label>
                    <textarea 
                        className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-slate-900 dark:text-white"
                        rows={3}
                        value={formData.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                        placeholder="Añade una descripción más detallada..."
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Asignado a</label>
                        <select
                            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                            value={formData.assignedTo as string || ''}
                            onChange={(e) => handleChange('assignedTo', e.target.value)}
                        >
                            <option value="">-- Sin asignar --</option>
                            {activeGroup?.members?.map(m => (
                                <option key={m.user.id} value={m.user.id}>{m.user.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fecha de Venc.</label>
                        <input
                            type="date"
                            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
                            value={formData.dueDate || ''}
                            onChange={(e) => handleChange('dueDate', e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Checklist</label>
                        <span className="text-xs font-semibold text-slate-500">{progress}%</span>
                    </div>
                    
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-2 overflow-hidden">
                        <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                    </div>
                    
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                        {tasks.map((task, index) => (
                            <div key={index} className="flex items-center gap-3 text-sm bg-slate-50 dark:bg-slate-900 p-2.5 rounded border border-transparent hover:border-slate-200 dark:hover:border-slate-700 group transition-colors">
                                <input 
                                    type="checkbox" 
                                    checked={task.completed} 
                                    onChange={() => toggleTask(index)}
                                    className="rounded border-slate-300 dark:border-slate-600 text-blue-500 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                                />
                                <span className={`flex-1 transition-all ${task.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-200'}`}>
                                    {task.title}
                                </span>
                                <button type="button" onClick={() => removeTask(index)} className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2 mt-2">
                        <input
                            type="text"
                            placeholder="Añadir una tarea..."
                            className="flex-1 px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTask())}
                        />
                        <Button type="button" size="sm" variant="outline" className="px-4" onClick={handleAddTask}>Añadir</Button>
                    </div>
                </div>

                <div className="pt-4 flex gap-3 justify-end border-t border-slate-200 dark:border-slate-800 mt-6">
                    <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
                    <Button type="submit">Guardar Cambios</Button>
                </div>
            </form>
        </Modal>
    );
}
