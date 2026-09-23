import { useState, useCallback } from "react";
import { useGroupStore } from "../store/groupStore";
import * as groupService from "../services/groupService";
import { ApiError } from "@/services/api/errors/ApiError";

export function useGroupDetail(groupId: string) {
    const { activeGroup, setActiveGroup, isLoading, setIsLoading } = useGroupStore();
    const [error, setError] = useState<string | null>(null);

    const fetchGroup = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await groupService.getGroupById(groupId);
            setActiveGroup(data);
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError("Error al obtener los detalles del grupo.");
            }
            setActiveGroup(null);
        } finally {
            setIsLoading(false);
        }
    }, [groupId, setActiveGroup, setIsLoading]);

    const clearActiveGroup = useCallback(() => {
        setActiveGroup(null);
    }, [setActiveGroup]);

    return {
        activeGroup,
        isLoading,
        error,
        fetchGroup,
        clearActiveGroup
    };
}
