import api from '@shared/api/axios';
import { ApiResponse, unwrap } from '@core/types/api';
import { AgentTask, CreateTaskDto } from '@features/agents/types/agents';

export const agentsApi = {
  getTasks: (): Promise<AgentTask[]> =>
    api.get<unknown, ApiResponse<AgentTask[]>>('/tasks').then(unwrap),

  getTask: (id: string): Promise<AgentTask> =>
    api.get<unknown, ApiResponse<AgentTask>>(`/tasks/${id}`).then(unwrap),

  createTask: (dto: CreateTaskDto): Promise<AgentTask> =>
    api.post<unknown, ApiResponse<AgentTask>>('/tasks', dto).then(unwrap),
};
