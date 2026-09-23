import apiClient from '@/services/api/apiClient';

export interface PerformanceData {
    created: number;
    completed: number;
    overdue: number;
    pending: number;
}

export const reportService = {
    getGroupPerformance: async (groupId: string) => {
        const response = await apiClient.get<{data: PerformanceData}>(`/reports/groups/${groupId}`);
        return response.data.data;
    },
    getUserPerformance: async (userId: string) => {
        const response = await apiClient.get<{data: PerformanceData}>(`/reports/users/${userId}`);
        return response.data.data;
    },
    getCompletedActivities: async (groupId: string) => {
        const response = await apiClient.get<{data: any[]}>(`/reports/groups/${groupId}/completed`);
        return response.data.data;
    }
};
