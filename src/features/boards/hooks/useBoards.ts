import { useState, useCallback } from "react";
import { useBoardStore } from "../store/boardStore";
import * as boardService from "../services/boardService";
import { ApiError } from "@/services/api/errors/ApiError";

export function useBoards(groupId?: string) {
    const { boards, setBoards, addBoard, removeBoard, isLoading, setIsLoading } = useBoardStore();
    const [error, setError] = useState<string | null>(null);

    const fetchBoards = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await boardService.findByGroupId(id);
            setBoards(data);
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError("Error al obtener los tableros.");
            }
            setBoards([]);
        } finally {
            setIsLoading(false);
        }
    }, [setBoards, setIsLoading]);

    return {
        boards,
        isLoading,
        error,
        fetchBoards: groupId ? () => fetchBoards(groupId) : fetchBoards,
        addBoard,
        removeBoard,
    };
}
