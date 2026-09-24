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
        const mappedCol = { ...column, _id: column.id || column._id, tarjetas: column.tarjetas || column.cards || [] };
        return {
            board: {
                ...state.board,
                columnas: [...state.board.columnas, mappedCol]
            }
        };
    }),
    updateColumn: (column) => set((state) => {
        if (!state.board) return state;
        const colId = column.id || column._id;
        return {
            board: {
                ...state.board,
                columnas: state.board.columnas.map(c => c._id === colId ? { ...c, ...column, _id: colId } : c)
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
        const mappedCard = { ...card, _id: card.id || card._id };
        return {
            board: {
                ...state.board,
                columnas: state.board.columnas.map(col => {
                    if (col._id === mappedCard.columnId) {
                        if (col.tarjetas.some(t => t._id === mappedCard._id)) return col;
                        return { ...col, tarjetas: [...col.tarjetas, mappedCard] };
                    }
                    return col;
                })
            }
        };
    }),
    updateCard: (card) => set((state) => {
        if (!state.board) return state;
        const mappedCard = { ...card, _id: card.id || card._id };
        return {
            board: {
                ...state.board,
                columnas: state.board.columnas.map(col => {
                    const hasCard = col.tarjetas.some(t => t._id === mappedCard._id);
                    
                    if (col._id === mappedCard.columnId) {
                        if (hasCard) {
                            return { ...col, tarjetas: col.tarjetas.map(t => t._id === mappedCard._id ? { ...t, ...mappedCard } : t) };
                        } else {
                            return { ...col, tarjetas: [...col.tarjetas, mappedCard] };
                        }
                    } else if (hasCard) {
                        return { ...col, tarjetas: col.tarjetas.filter(t => t._id !== mappedCard._id) };
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
