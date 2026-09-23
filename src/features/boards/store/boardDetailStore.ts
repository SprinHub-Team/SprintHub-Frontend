import { create } from "zustand";

export interface Comment {
    _id: string;
    content: string;
    cardId: string;
    userId: string;
    createdAt: string;
}

export interface Card {
    _id: string;
    title: string;
    description?: string;
    columnId: string;
    position: number;
    assignedTo?: string;
    dueDate?: string;
    priority: 'alta' | 'media' | 'baja';
    tasks: { title: string; completed: boolean; _id?: string }[];
    attachments: any[];
    comentarios?: Comment[];
}

export interface Column {
    _id: string;
    name: string;
    boardId: string;
    tarjetas: Card[];
}

export interface BoardDetails {
    _id: string;
    title: string;
    description?: string;
    groupId: string;
    ownerId: string;
    columnas: Column[];
}

interface BoardDetailState {
    board: BoardDetails | null;
    isLoading: boolean;
    error: string | null;

    setBoard: (board: BoardDetails | null) => void;
    setIsLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;

    // Métodos para actualizar localmente tras recibir eventos de socket
    addColumn: (column: any) => void;
    updateColumn: (column: any) => void;
    deleteColumn: (columnId: string) => void;

    addCard: (card: any) => void;
    updateCard: (card: any) => void;
    deleteCard: (cardId: string) => void;
}

export const useBoardDetailStore = create<BoardDetailState>((set) => ({
    board: null,
    isLoading: true,
    error: null,

    setBoard: (board) => set({ board, isLoading: false, error: null }),
    setIsLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error, isLoading: false }),

    addColumn: (column) => set((state) => {
        if (!state.board) return state;
        return {
            board: {
                ...state.board,
                columnas: [...state.board.columnas, { ...column, tarjetas: [] }]
            }
        };
    }),
    updateColumn: (column) => set((state) => {
        if (!state.board) return state;
        return {
            board: {
                ...state.board,
                columnas: state.board.columnas.map(c => c._id === column._id ? { ...c, ...column } : c)
            }
        };
    }),
    deleteColumn: (columnId) => set((state) => {
        if (!state.board) return state;
        return {
            board: {
                ...state.board,
                columnas: state.board.columnas.filter(c => c._id !== columnId)
            }
        };
    }),

    addCard: (card) => set((state) => {
        if (!state.board) return state;
        return {
            board: {
                ...state.board,
                columnas: state.board.columnas.map(col => {
                    if (col._id === card.columnId) {
                        return { ...col, tarjetas: [...col.tarjetas, card] };
                    }
                    return col;
                })
            }
        };
    }),
    updateCard: (card) => set((state) => {
        if (!state.board) return state;
        return {
            board: {
                ...state.board,
                columnas: state.board.columnas.map(col => {
                    // Si la tarjeta cambió de columna, tenemos que removerla de la antigua y agregarla a la nueva
                    // Para simplificar, primero verificamos si la columna actualiza contiene la tarjeta
                    const hasCard = col.tarjetas.some(t => t._id === card._id);
                    
                    if (col._id === card.columnId) {
                        if (hasCard) {
                            return { ...col, tarjetas: col.tarjetas.map(t => t._id === card._id ? { ...t, ...card } : t) };
                        } else {
                            return { ...col, tarjetas: [...col.tarjetas, card] };
                        }
                    } else if (hasCard) {
                        return { ...col, tarjetas: col.tarjetas.filter(t => t._id !== card._id) };
                    }
                    return col;
                })
            }
        };
    }),
    deleteCard: (cardId) => set((state) => {
        if (!state.board) return state;
        return {
            board: {
                ...state.board,
                columnas: state.board.columnas.map(col => {
                    return { ...col, tarjetas: col.tarjetas.filter(t => t._id !== cardId) };
                })
            }
        };
    })
}));
