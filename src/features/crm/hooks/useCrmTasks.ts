import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@shared/api/axios';
import type { CrmTask, CreateTaskInput, TaskStatus } from '../types';

export function useCrmTasks(filters: { status?: TaskStatus; contact_id?: string } = {}) {
  return useQuery<CrmTask[]>({
    queryKey: ['crm-tasks', filters],
    queryFn: async () => {
      const { data } = await api.get('/crm/tasks', { params: filters });
      return data;
    },
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateTaskInput) => {
      const { data } = await api.post('/crm/tasks', input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['contacts'] }); // Activities might change
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<CrmTask> & { id: string }) => {
      const { data } = await api.patch(`/crm/tasks/${id}`, input);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-tasks'] });
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/crm/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crm-tasks'] });
    },
  });
}
