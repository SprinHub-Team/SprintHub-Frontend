import { z } from 'zod';
import { apiClient } from '@/services/api/client';

export const issueSchema = z.object({
  id: z.string(), title: z.string(), description: z.string(), groupId: z.string(), sprintId: z.string().nullable(),
  assignedTo: z.object({ id: z.string(), name: z.string(), email: z.string() }).nullable(),
  dueDate: z.string().nullable(), priority: z.enum(['alta', 'media', 'baja']),
  rank: z.number(), issueType: z.enum(['historia', 'tarea', 'error']), epic: z.string(), storyPoints: z.number(),
  status: z.enum(['pendiente', 'en_progreso', 'completada']),
  linkedCardId: z.string().nullable().optional(), boardId: z.string().nullable().optional(),
});
const sprintSchema = z.object({ id: z.string(), name: z.string(), goal: z.string(), startDate: z.string(), endDate: z.string(), status: z.enum(['planificado', 'activo', 'completado']) });
const planningSchema = z.object({ cards: z.array(issueSchema), sprints: z.array(sprintSchema), destinations: z.array(z.object({ id: z.string(), name: z.string(), boardId: z.string(), boardName: z.string() })) });
export type Issue = z.infer<typeof issueSchema>;
export type Sprint = z.infer<typeof sprintSchema>;
export type Planning = z.infer<typeof planningSchema>;
export type IssueInput = Pick<Issue, 'title' | 'description' | 'priority' | 'dueDate' | 'issueType' | 'epic' | 'storyPoints' | 'status'> & { assignedTo?: string | null };

export const backlogService = {
  async load(groupId: string) { return planningSchema.parse((await apiClient.get(`/cardPB/group/${groupId}/planning`)).data); },
  async create(groupId: string, data: IssueInput) { return issueSchema.parse((await apiClient.post('/cardPB', { ...data, assignedTo: data.assignedTo || undefined, groupId })).data); },
  async update(id: string, data: Partial<IssueInput> & { rank?: number }) { await apiClient.patch(`/cardPB/${id}`, data); },
  async reorder(groupId: string, sprintId: string | null, ids: string[]) { await apiClient.post('/cardPB/reorder', { groupId, sprintId, ids }); },
  async remove(id: string) { await apiClient.delete(`/cardPB/${id}`); },
  async move(id: string, sprintId: string | null) { await apiClient.put(`/sprints/cards/${id}/move`, { sprintId }); },
  async createSprint(groupId: string, data: { name: string; goal: string; startDate: string; endDate: string }) { await apiClient.post('/sprints', { ...data, groupId }); },
  async transition(id: string, status: 'activo' | 'completado', columnId?: string) { await apiClient.patch(`/sprints/${id}/status`, { status, columnId }); },
  async deleteSprint(id: string) { await apiClient.delete(`/sprints/${id}`); },
  async link(id: string, columnId: string) { await apiClient.post(`/sprints/cards/${id}/export`, { columnId }); },
  async exportCsv(groupId: string) {
    const response = await apiClient.get(`/cardPB/group/${groupId}/export-csv`, { responseType: 'blob' });
    const url = URL.createObjectURL(response.data); const a = document.createElement('a');
    a.href = url; a.download = 'product-backlog.csv'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  },
};
