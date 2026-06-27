import api from "@shared/api/axios";
import { AgentTask, CreateTaskDto } from "@features/agents/types/agents";

export const agentsApi = {
  getTasks: async (): Promise<AgentTask[]> => {
    const { data } = await api.get("/tasks");
    return data;
  },

  getTask: async (id: string): Promise<AgentTask> => {
    const { data } = await api.get(`/tasks/${id}`);
    return data;
  },

  createTask: async (dto: CreateTaskDto): Promise<AgentTask> => {
    const { data } = await api.post("/tasks", dto);
    return data;
  },
};
