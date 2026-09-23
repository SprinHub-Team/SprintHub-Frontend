import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { socketClient } from "@/services/socket/socketClient";
import { useBoardDetailStore, type Card } from "../store/boardDetailStore";
import { BoardColumn } from "../components/BoardColumn";
import { EditCardModal } from "../components/EditCardModal";
import Alert from "@/components/common/ui/Alert";
import Button from "@/components/common/ui/Button";

function BoardPage() {
    const { id } = useParams<{ id: string }>();
    const { 
        board, isLoading, error, 
        setBoard, setError, setIsLoading,
        addColumn, updateColumn, deleteColumn,
        addCard, updateCard, deleteCard
    } = useBoardDetailStore();

    const [isAddingColumn, setIsAddingColumn] = useState(false);
    const [newColumnName, setNewColumnName] = useState('');
    
    // Modal de edición de tarjeta
    const [editingCard, setEditingCard] = useState<Card | null>(null);

    useEffect(() => {
        if (!id) return;

        setIsLoading(true);
        const socket = socketClient.connect();

        if (!socket) {
            setError('No hay sesión de socket. Inicia sesión nuevamente.');
            setIsLoading(false);
            return;
        }

        const handleConnect = () => {
            socket.emit('board:join', id, (res: any) => {
                if (res.ok) {
                    setBoard(res.board);
                } else {
                    setError(res.error || 'Error al unir al tablero');
                }
            });
        };

        if (socket.connected) {
            handleConnect();
        } else {
            socket.on('connect', handleConnect);
        }

        // Suscribirse a eventos de columnas
        socket.on('column:created', addColumn);
        socket.on('column:updated', updateColumn);
        socket.on('column:deleted', (data: any) => deleteColumn(data.columnId));

        // Suscribirse a eventos de tarjetas
        socket.on('card:created', addCard);
        socket.on('card:updated', updateCard);
        socket.on('card:deleted', (cardId: string) => {
            // Elimina la tarjeta buscando en todas las columnas
            deleteCard(cardId); 
        });

        return () => {
            socket.emit('board:leave', id);
            socket.off('connect', handleConnect);
            socket.off('column:created', addColumn);
            socket.off('column:updated', updateColumn);
            socket.off('column:deleted');
            socket.off('card:created', addCard);
            socket.off('card:updated', updateCard);
            socket.off('card:deleted');
            setBoard(null);
        };
    }, [id, setBoard, setError, setIsLoading, addColumn, updateColumn, deleteColumn, addCard, updateCard, deleteCard]);

    const handleAddColumn = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newColumnName.trim()) return;

        const socket = socketClient.getSocket();
        if (socket) {
            socket.emit('column:create', { name: newColumnName, boardId: id }, (res: any) => {
                if (res.ok) {
                    addColumn(res.column);
                    setNewColumnName('');
                    setIsAddingColumn(false);
                } else {
                    alert('Error al crear columna: ' + res.error);
                }
            });
        }
    };

    if (isLoading) return <div className="p-6 text-center animate-pulse">Cargando tablero...</div>;
    if (error) return <div className="p-6"><Alert variant="danger">{error}</Alert></div>;
    if (!board) return <div className="p-6 text-center text-[var(--text-secondary)]">Tablero no encontrado.</div>;

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col bg-slate-50 dark:bg-slate-900 overflow-hidden">
            <header className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm flex items-center justify-between shrink-0 z-10">
                <div className="flex items-center gap-4">
                    <Link to={`/groups/${board.groupId}`} className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{board.title}</h1>
                        {board.description && <p className="text-sm text-slate-500 dark:text-slate-400">{board.description}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* Add members to board visually or other board actions */}
                    <div className="flex -space-x-2 mr-4">
                        {/* Placeholder avatars */}
                        <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white dark:border-slate-950 flex items-center justify-center text-xs font-bold text-white">TU</div>
                    </div>
                </div>
            </header>
            
            <main className="flex-1 overflow-x-auto overflow-y-hidden">
                <div className="flex gap-6 h-full items-start p-6 pb-8">
                    {board.columnas.map(column => (
                        <BoardColumn 
                            key={column._id} 
                            column={column} 
                            onEditCard={setEditingCard} 
                        />
                    ))}
                    
                    {/* Botón / Formulario para añadir columna */}
                    <div className="w-[300px] shrink-0">
                        {isAddingColumn ? (
                            <form onSubmit={handleAddColumn} className="bg-white dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
                                <input 
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                                    placeholder="Nombre de la columna"
                                    value={newColumnName}
                                    onChange={(e) => setNewColumnName(e.target.value)}
                                    autoFocus
                                />
                                <div className="flex gap-2">
                                    <Button type="submit" size="sm" className="flex-1">Añadir</Button>
                                    <Button type="button" variant="outline" size="sm" onClick={() => setIsAddingColumn(false)}>Cancelar</Button>
                                </div>
                            </form>
                        ) : (
                            <button 
                                onClick={() => setIsAddingColumn(true)}
                                className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-200/50 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all font-medium"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                <span>Añadir otra columna</span>
                            </button>
                        )}
                    </div>
                </div>
            </main>

            <EditCardModal 
                card={editingCard}
                isOpen={!!editingCard}
                onClose={() => setEditingCard(null)}
            />
        </div>
    );
}

export default BoardPage;
