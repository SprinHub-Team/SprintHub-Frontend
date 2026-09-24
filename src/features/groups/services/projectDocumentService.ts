import apiClient from "@/services/api/apiClient";

export interface ProjectDocument {
    _id: string;
    title: string;
    fileName: string;
    fileUrl: string;
    groupId: string;
    uploadedBy: string;
    createdAt: string;
}

interface ApiResponse<T> {
    data: T;
    message?: string;
}

export async function getProjectDocuments(groupId: string): Promise<ProjectDocument[]> {
    const response = await apiClient.get<ApiResponse<ProjectDocument[]>>(`/projectDocuments/group/${groupId}`);
    return response.data.data;
}

export async function uploadProjectDocument(groupId: string, file: File): Promise<ProjectDocument> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post<ApiResponse<ProjectDocument>>(`/projectDocuments/${groupId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.data;
}

export async function deleteProjectDocument(documentId: string): Promise<void> {
    await apiClient.delete(`/projectDocuments/${documentId}`);
}
