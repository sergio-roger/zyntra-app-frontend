import { CreateTaskInput } from '@crm/types/create-task-input';
import { TaskStatus } from '@crm/types/crm';
import { CrmTask } from '@crm/types/crm-task';
import api from '@shared/api/axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useCrmTasks(
  filters: { status?: TaskStatus; contact_id?: string } = {},
) {
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
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
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
