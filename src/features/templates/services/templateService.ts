import apiClient from '@/services/api/apiClient';

export interface TemplateColumn {
    title: string;
    order: number;
}

export interface BoardTemplate {
    id: string;
    name: string;
    description: string;
    columns: TemplateColumn[];
}

export const templateService = {
    getAllTemplates: async () => {
        const response = await apiClient.get<BoardTemplate[]>('/templates');
        return response.data;
    },
    applyTemplate: async (boardId: string, templateId: string) => {
        const response = await apiClient.post(`/boards/${boardId}/apply-template`, { templateId });
        return response.data;
    }
};
