import { create } from "zustand";
import type { Board } from "../types/board.schema";

interface BoardState {
    boards: Board[];
    activeBoard: Board | null;
    isLoading: boolean;
    
    setBoards: (boards: Board[]) => void;
    setActiveBoard: (board: Board | null) => void;
    addBoard: (board: Board) => void;
    updateBoardInStore: (board: Board) => void;
    removeBoard: (boardId: string) => void;
    setIsLoading: (isLoading: boolean) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
    boards: [],
    activeBoard: null,
    isLoading: false,

    setBoards: (boards) => set({ boards }),
    setActiveBoard: (board) => set({ activeBoard: board }),
    addBoard: (board) => set((state) => ({ boards: [...state.boards, board] })),
    updateBoardInStore: (updatedBoard) => set((state) => ({
        boards: state.boards.map(b => b.id === updatedBoard.id ? updatedBoard : b),
        activeBoard: state.activeBoard?.id === updatedBoard.id ? updatedBoard : state.activeBoard
    })),
    removeBoard: (boardId) => set((state) => ({
        boards: state.boards.filter(b => b.id !== boardId),
        activeBoard: state.activeBoard?.id === boardId ? null : state.activeBoard
    })),
    setIsLoading: (isLoading) => set({ isLoading }),
}));
