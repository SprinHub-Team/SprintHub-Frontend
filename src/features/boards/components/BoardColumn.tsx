import { useState } from 'react';
import { useBoardDetailStore, type Column, type Card } from '../store/boardDetailStore';
import { TaskCard } from './TaskCard';
import { socketClient } from '@/services/socket/socketClient';
import Button from '@/components/common/ui/Button';
import Input from '@/components/common/ui/Input';

interface BoardColumnProps {
    column: Column;
    onEditCard: (card: Card) => void;
}

export function BoardColumn({ column, onEditCard }: BoardColumnProps) {
    const { addCard, updateCard, deleteColumn, updateColumn } = useBoardDetailStore();
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [newCardTitle, setNewCardTitle] = useState('');

    const handleAddCard = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCardTitle.trim()) return;

        const socket = socketClient.getSocket();
        if (socket) {
            socket.emit('card:create', {
                title: newCardTitle,
                columnId: column._id,
                position: column.tarjetas.length,
                boardId: column.boardId
            }, (res: any) => {
                if (res.ok) {
                    addCard(res.card);
                    setNewCardTitle('');
                    setIsAddingCard(false);
                } else {
                    alert('Error al crear tarjeta: ' + res.error);
                }
            });
        }
    };

    const handleDeleteColumn = () => {
        if (confirm(`¿Eliminar la columna ${column.name}? Las tarjetas dentro también se eliminaran.`)) {
            const socket = socketClient.getSocket();
            if (socket) {
                socket.emit('column:delete', column._id, (res: any) => {
                    if (res.ok) {
                        deleteColumn(column._id);
                    } else {
                        alert('Error al eliminar columna: ' + res.error);
                    }
                });
            }
        }
    };

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editColumnName, setEditColumnName] = useState(column.name);

    const handleUpdateColumn = (e: React.FormEvent | React.FocusEvent) => {
        e.preventDefault();
        if (editColumnName.trim() === column.name) {
            setIsEditingTitle(false);
            return;
        }

        const socket = socketClient.getSocket();
        if (socket) {
            socket.emit('column:update', {
                paramData: { columnId: column._id },
                columnData: { name: editColumnName }
            }, (res: any) => {
                if (res.ok) {
                    updateColumn(res.column);
                    setIsEditingTitle(false);
                } else {
                    alert('Error al renombrar: ' + res.error);
                    setEditColumnName(column.name);
                    setIsEditingTitle(false);
                }
            });
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData('cardId');
        const sourceColumnId = e.dataTransfer.getData('sourceColumnId');

        if (!cardId || sourceColumnId === column._id) return;

        const socket = socketClient.getSocket();
        if (socket) {
            socket.emit('card:update', {
                paramData: { cardId },
                cardData: { columnId: column._id }
            }, (res: any) => {
                if (res.ok) {
                    updateCard(res.card);
                } else {
                    alert('Error al mover tarjeta: ' + res.error);
                }
            });
        }
    };

    return (
        <div 
            className="w-[300px] shrink-0 bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex flex-col max-h-full shadow-sm backdrop-blur-sm"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <div className="flex items-center justify-between p-3 px-4 group">
                {isEditingTitle ? (
                    <form onSubmit={handleUpdateColumn} className="flex-1 mr-2">
                        <input
                            autoFocus
                            className="w-full px-2 py-1 text-sm bg-white dark:bg-slate-900 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-semibold text-slate-900 dark:text-white"
                            value={editColumnName}
                            onChange={(e) => setEditColumnName(e.target.value)}
                            onBlur={handleUpdateColumn}
                        />
                    </form>
                ) : (
                    <h3 
                        className="font-semibold text-slate-700 dark:text-slate-200 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2" 
                        onClick={() => setIsEditingTitle(true)}
                    >
                        {column.name} 
                        <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-2 py-0.5 rounded-full">
                            {column.tarjetas.length}
                        </span>
                    </h3>
                )}
                <button 
                    onClick={handleDeleteColumn} 
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                    title="Eliminar columna"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            </div>
            
            <div className="flex-1 overflow-y-auto px-3 space-y-3 min-h-[50px] scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 pb-2">
                {column.tarjetas.map(card => (
                    <TaskCard key={card._id} card={card} onEdit={onEditCard} />
                ))}
            </div>

            <div className="p-3">
                {isAddingCard ? (
                    <form onSubmit={handleAddCard} className="space-y-2">
                        <textarea
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm resize-none shadow-sm"
                            placeholder="Título de la tarjeta"
                            value={newCardTitle}
                            onChange={(e) => setNewCardTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleAddCard(e);
                                }
                            }}
                            autoFocus
                            rows={2}
                        />
                        <div className="flex gap-2">
                            <Button type="submit" className="flex-1 text-xs py-1.5 px-3">Guardar</Button>
                            <Button type="button" variant="ghost" className="text-xs py-1.5 px-3" onClick={() => setIsAddingCard(false)}>Cancelar</Button>
                        </div>
                    </form>
                ) : (
                    <button 
                        onClick={() => setIsAddingCard(true)}
                        className="w-full py-2 px-3 text-sm text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        <span>Añadir tarjeta</span>
                    </button>
                )}
            </div>
        </div>
    );
}
