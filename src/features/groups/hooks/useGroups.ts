import { useState, useCallback } from "react";
import { useGroupStore } from "../store/groupStore";
import * as groupService from "../services/groupService";
import { ApiError } from "@/services/api/errors/ApiError";

export function useGroups() {
    const { groups, setGroups, addGroup, removeGroup, isLoading, setIsLoading } = useGroupStore();
    const [error, setError] = useState<string | null>(null);

    const fetchGroups = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await groupService.getMyGroups();
            setGroups(data);
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                setError(err.message);
            } else {
                setError("Error al obtener los grupos.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [setGroups, setIsLoading]);

    return {
        groups,
        isLoading,
        error,
        fetchGroups,
        addGroup,
        removeGroup,
    };
}
