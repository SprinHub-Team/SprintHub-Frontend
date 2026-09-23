import { useState } from 'react';
import { useBoardDetailStore, type Card } from '../store/boardDetailStore';
import { socketClient } from '@/services/socket/socketClient';

interface TaskCardProps {
    card: Card;
    onEdit: (card: Card) => void;
}

export function TaskCard({ card, onEdit }: TaskCardProps) {
    const { deleteCard } = useBoardDetailStore();
    const priorityColors = {
        alta: 'bg-red-100 text-red-700 border-red-200',
        media: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        baja: 'bg-green-100 text-green-700 border-green-200'
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('¿Eliminar esta tarjeta?')) {
            const socket = socketClient.getSocket();
            if (socket) {
                socket.emit('card:delete', card._id, (res: any) => {
                    if (res.ok) {
                        deleteCard(card._id);
                    } else {
                        alert('Error al eliminar: ' + res.error);
                    }
                });
            }
        }
    };

    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('cardId', card._id);
        e.dataTransfer.setData('sourceColumnId', card.columnId);
        // Hacerlo un poco transparente mientras se arrastra
        setTimeout(() => {
            if (e.target instanceof HTMLElement) {
                e.target.style.opacity = '0.5';
            }
        }, 0);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        if (e.target instanceof HTMLElement) {
            e.target.style.opacity = '1';
        }
    };

    return (
        <div 
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={() => onEdit(card)}
            className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-grab active:cursor-grabbing group"
        >
            <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${priorityColors[card.priority]}`}>
                    {card.priority}
                </span>
                <button 
                    onClick={handleDelete}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
                    title="Eliminar tarjeta"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
            </div>
            
            <h4 className="font-medium text-sm text-slate-800 dark:text-slate-100 mb-1.5 leading-snug">{card.title}</h4>
            
            {card.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                    {card.description}
                </p>
            )}

            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
                {card.dueDate && (
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span>{new Date(card.dueDate).toLocaleDateString()}</span>
                    </div>
                )}
                
                {card.tasks && card.tasks.length > 0 && (
                    <div className={`flex items-center gap-1 ${card.tasks.filter(t => t.completed).length === card.tasks.length ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-1.5 py-0.5 rounded' : ''}`}>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                        <span>{card.tasks.filter(t => t.completed).length}/{card.tasks.length}</span>
                    </div>
                )}
                
                {card.comentarios && card.comentarios.length > 0 && (
                    <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                        <span>{card.comentarios.length}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
