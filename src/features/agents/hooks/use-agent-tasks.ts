import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { agentsApi } from '../api/agents.api';
import { AgentTaskStatus } from '../types';

export const useAgentTasks = () => {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ['agent-tasks'],
    queryFn: agentsApi.getTasks,
    refetchInterval: (query) => {
      // Si hay alguna tarea pendiente o ejecutándose, hacemos polling cada 3 segundos
      const hasPending = query.state.data?.some(
        (t) => t.status === AgentTaskStatus.PENDING || t.status === AgentTaskStatus.RUNNING
      );
      return hasPending ? 3000 : false;
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: agentsApi.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agent-tasks'] });
    },
  });

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    isCreating: createTaskMutation.isPending,
    createTask: createTaskMutation.mutateAsync,
    refetch: tasksQuery.refetch,
  };
};
