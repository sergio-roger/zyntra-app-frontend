import api from '@shared/api/axios';
import { ApiResponse, unwrap } from '@core/types/api';
import {
  AiAgent,
  AgentTestResult,
  CreateAgentPayload,
  UpdateAgentPayload,
} from '../types/ai-agents.types';

export const aiAgentsApi = {
  list: (businessId: string): Promise<AiAgent[]> =>
    api
      .get<unknown, ApiResponse<AiAgent[]>>(`/businesses/${businessId}/agents`)
      .then(unwrap),

  get: (businessId: string, agentId: string): Promise<AiAgent> =>
    api
      .get<unknown, ApiResponse<AiAgent>>(
        `/businesses/${businessId}/agents/${agentId}`,
      )
      .then(unwrap),

  create: (businessId: string, payload: CreateAgentPayload): Promise<AiAgent> =>
    api
      .post<unknown, ApiResponse<AiAgent>>(
        `/businesses/${businessId}/agents`,
        payload,
      )
      .then(unwrap),

  update: (
    businessId: string,
    agentId: string,
    payload: UpdateAgentPayload,
  ): Promise<AiAgent> =>
    api
      .patch<unknown, ApiResponse<AiAgent>>(
        `/businesses/${businessId}/agents/${agentId}`,
        payload,
      )
      .then(unwrap),

  remove: (
    businessId: string,
    agentId: string,
  ): Promise<{ success: boolean }> =>
    api
      .delete<unknown, ApiResponse<{ success: boolean }>>(
        `/businesses/${businessId}/agents/${agentId}`,
      )
      .then(unwrap),

  test: (
    businessId: string,
    agentId: string,
    message: string,
  ): Promise<AgentTestResult> =>
    api
      .post<unknown, ApiResponse<AgentTestResult>>(
        `/businesses/${businessId}/agents/${agentId}/test`,
        { message },
      )
      .then(unwrap),
};
