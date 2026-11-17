import { z } from 'zod';
import { apiClient } from '@/services/api/client';

const counts = z.object({
  created: z.number(),
  completed: z.number(),
  pending: z.number(),
  overdue: z.number(),
});

const statisticsSchema = z.object({
  totals: counts,
  unassigned: counts,
  users: z.array(counts.extend({ id: z.string(), name: z.string(), profilePicture: z.string() })),
  generatedAt: z.string(),
});

const completedActivitySchema = z.object({
  id: z.string(),
  title: z.string(),
  assignedTo: z.string().nullable(),
  createdAt: z.string().nullable(),
});

const statisticsResponse = z.object({ data: statisticsSchema });
const completedActivitiesResponse = z.object({ data: z.array(completedActivitySchema) });

export type Statistics = z.infer<typeof statisticsSchema>;
export type CompletedActivity = z.infer<typeof completedActivitySchema>;

export const statisticsService = {
  async load(groupId: string) {
    const response = await apiClient.get<unknown>(`/reports/groups/${groupId}/statistics`);
    return statisticsResponse.parse(response.data).data;
  },
  async completed(groupId: string) {
    const response = await apiClient.get<unknown>(`/reports/groups/${groupId}/completed`);
    return completedActivitiesResponse.parse(response.data).data;
  },
};
