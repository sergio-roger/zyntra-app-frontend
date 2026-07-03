import api from "@shared/api/axios";
import { DealPipeline } from "@crm/types/deal-pipeline";
import { DealPipelineStage } from "@crm/types/deal-pipeline-stage";
import { PipelineForecast } from "@crm/types/pipeline-forecast";

export interface CreatePipelineInput {
  name: string;
  position?: number;
  is_default?: boolean;
  team_id?: string | null;
}

export interface CreateStageInput {
  name: string;
  color?: string;
  position?: number;
  type?: "active" | "won" | "lost";
  probability_percent?: number;
}

export interface ReorderStagesInput {
  stages: { id: string; position: number }[];
}

export const pipelinesApi = {
  list: () => api.get<unknown, { data: DealPipeline[] }>("/crm/pipelines"),

  create: (input: CreatePipelineInput) =>
    api.post<unknown, { data: DealPipeline }>("/crm/pipelines", input),

  update: (id: string, input: Partial<CreatePipelineInput>) =>
    api.patch<unknown, { data: DealPipeline }>(`/crm/pipelines/${id}`, input),

  remove: (id: string) => api.delete(`/crm/pipelines/${id}`),

  forecast: (pipelineId: string) =>
    api.get<unknown, { data: PipelineForecast }>(
      `/crm/pipelines/${pipelineId}/forecast`,
    ),

  listStages: (pipelineId: string) =>
    api.get<unknown, { data: DealPipelineStage[] }>(
      `/crm/pipelines/${pipelineId}/stages`,
    ),

  createStage: (pipelineId: string, input: CreateStageInput) =>
    api.post<unknown, { data: DealPipelineStage }>(
      `/crm/pipelines/${pipelineId}/stages`,
      input,
    ),

  reorderStages: (pipelineId: string, input: ReorderStagesInput) =>
    api.patch<unknown, { data: DealPipelineStage[] }>(
      `/crm/pipelines/${pipelineId}/stages/reorder`,
      input,
    ),

  updateStage: (stageId: string, input: Partial<CreateStageInput>) =>
    api.patch<unknown, { data: DealPipelineStage }>(
      `/crm/pipelines/stages/${stageId}`,
      input,
    ),

  deleteStage: (stageId: string) =>
    api.delete(`/crm/pipelines/stages/${stageId}`),
};
