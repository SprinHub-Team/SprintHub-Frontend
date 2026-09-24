import { useBoardDetailStore, type Card } from '../store/boardDetailStore';
import { useGroupDetail } from '@/features/groups/hooks/useGroupDetail';
import { socketClient } from '@/services/socket/socketClient';

interface TaskCardProps {
    card: Card;
    onEdit: (card: Card) => void;
}

export function TaskCard({ card, onEdit }: TaskCardProps) {
    const { deleteCard, board } = useBoardDetailStore();
    const { activeGroup } = useGroupDetail(board?.groupId || '');

    const priorityColors = {
        alta: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800',
        media: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800',
        baja: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
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

    const assigneeId = (card.assignedTo && typeof card.assignedTo === 'object') ? (card.assignedTo as any).id : card.assignedTo;
    const assignee = activeGroup?.members?.find(m => m.user.id === assigneeId)?.user;

    const completedTasks = card.tasks?.filter(t => t.completed).length || 0;
    const totalTasks = card.tasks?.length || 0;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <div 
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onClick={() => onEdit(card)}
            className="bg-white dark:bg-[#1d2125] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-grab active:cursor-grabbing group"
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
            
            <h4 className="font-medium text-sm text-slate-800 dark:text-slate-100 mb-2 leading-snug">{card.title}</h4>
            
            {card.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                    {card.description}
                </p>
            )}

            {totalTasks > 0 && (
                <div className="mb-3 space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-medium text-slate-500 dark:text-slate-400">
                        <span>Checklist</span>
                        <span>{completedTasks}/{totalTasks}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-1.5 rounded-full transition-all duration-300 ${progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                    {card.dueDate && (
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <span>{new Date(card.dueDate).toLocaleDateString()}</span>
                        </div>
                    )}
                    {card.comentarios && card.comentarios.length > 0 && (
                        <div className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                            <span>{card.comentarios.length}</span>
                        </div>
                    )}
                </div>

                {assignee && (
                    <div className="flex-shrink-0" title={assignee.name}>
                        {assignee.profilePicture ? (
                            <img src={assignee.profilePicture} alt={assignee.name} className="w-6 h-6 rounded-full border border-slate-200 dark:border-slate-700 object-cover" />
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center justify-center font-bold text-[10px]">
                                {assignee.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

