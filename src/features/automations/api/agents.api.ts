import api from '@shared/api/axios';
import { ApiResponse, unwrap } from '@core/types/api';
import {
  Agent,
  AgentTestResult,
  CreateAgentPayload,
  UpdateAgentPayload,
} from '../types/automations';

export const agentsApi = {
  list: (businessId: string): Promise<Agent[]> =>
    api
      .get<unknown, ApiResponse<Agent[]>>(`/businesses/${businessId}/agents`)
      .then(unwrap),

  get: (businessId: string, agentId: string): Promise<Agent> =>
    api
      .get<unknown, ApiResponse<Agent>>(
        `/businesses/${businessId}/agents/${agentId}`,
      )
      .then(unwrap),

  create: (businessId: string, payload: CreateAgentPayload): Promise<Agent> =>
    api
      .post<unknown, ApiResponse<Agent>>(
        `/businesses/${businessId}/agents`,
        payload,
      )
      .then(unwrap),

  update: (
    businessId: string,
    agentId: string,
    payload: UpdateAgentPayload,
  ): Promise<Agent> =>
    api
      .patch<unknown, ApiResponse<Agent>>(
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
