/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from '@/services/api/apiClient';

export interface Sprint {
    _id: string;
    name: string;
    goal?: string;
    startDate: string;
    endDate: string;
    status: 'planificado' | 'activo' | 'completado';
    groupId: string;
    createdAt: string;
    updatedAt: string;
}

export const sprintService = {
    createSprint: async (data: Partial<Sprint>) => {
        const response = await apiClient.post<Sprint>('/sprints', data);
        return response.data;
    },

    getSprintsByGroup: async (groupId: string) => {
        const response = await apiClient.get<Sprint[]>(`/sprints/group/${groupId}`);
        return response.data;
    },

    getSprintCards: async (sprintId: string) => {
        // Returns cards from Product Backlog assigned to this sprint
        const response = await apiClient.get<any[]>(`/sprints/${sprintId}/cards`);
        return response.data;
    },

    moveCardToSprint: async (cardId: string, sprintId: string | null) => {
        const response = await apiClient.put(`/sprints/cards/${cardId}/move`, { sprintId });
        return response.data;
    },

    exportToBoard: async (cardId: string, columnId: string) => {
        const response = await apiClient.post(`/sprints/cards/${cardId}/export`, { columnId });
        return response.data;
    }
};
