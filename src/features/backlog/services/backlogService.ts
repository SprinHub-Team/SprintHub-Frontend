import apiClient from '@/services/api/apiClient';

export interface CardPB {
    _id: string;
    title: string;
    description?: string;
    groupId: string;
    sprintId?: string | null;
    assignedTo?: { _id: string, name: string, email: string } | string | null;
    dueDate?: string;
    priority: 'alta' | 'media' | 'baja';
    tasks: { title: string; completed: boolean; _id?: string }[];
    createdAt: string;
    updatedAt: string;
}

export const backlogService = {
    getBacklog: async (groupId: string, search?: string) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        const response = await apiClient.get<CardPB[]>(`/cardPB/group/${groupId}?${params.toString()}`);
        return response.data;
    },

    createCard: async (data: Partial<CardPB> & { groupId: string }) => {
        const response = await apiClient.post<CardPB>('/cardPB', data);
        return response.data;
    },

    deleteCard: async (cardId: string) => {
        const response = await apiClient.delete(`/cardPB/${cardId}`);
        return response.data;
    },

    exportCsvUrl: (groupId: string) => {
        return `${import.meta.env.VITE_API_URL}/cardPB/group/${groupId}/export-csv`;
    }
};
