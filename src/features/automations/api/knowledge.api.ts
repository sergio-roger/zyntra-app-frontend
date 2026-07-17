import api from '@shared/api/axios';
import { ApiResponse, unwrap } from '@core/types/api';
import { KnowledgeDocument, KnowledgeUsage } from '../types/automations';

export const knowledgeApi = {
  list: (businessId: string, agentId: string): Promise<KnowledgeDocument[]> =>
    api
      .get<unknown, ApiResponse<KnowledgeDocument[]>>(
        `/businesses/${businessId}/agents/${agentId}/knowledge/documents`,
      )
      .then(unwrap),

  upload: (
    businessId: string,
    agentId: string,
    file: File,
  ): Promise<KnowledgeDocument> => {
    const formData = new FormData();
    formData.append('file', file);
    return api
      .post<unknown, ApiResponse<KnowledgeDocument>>(
        `/businesses/${businessId}/agents/${agentId}/knowledge/documents`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      .then(unwrap);
  },

  remove: (
    businessId: string,
    agentId: string,
    documentId: string,
  ): Promise<{ success: boolean }> =>
    api
      .delete<unknown, ApiResponse<{ success: boolean }>>(
        `/businesses/${businessId}/agents/${agentId}/knowledge/documents/${documentId}`,
      )
      .then(unwrap),

  reprocess: (
    businessId: string,
    agentId: string,
    documentId: string,
  ): Promise<KnowledgeDocument> =>
    api
      .post<unknown, ApiResponse<KnowledgeDocument>>(
        `/businesses/${businessId}/agents/${agentId}/knowledge/documents/${documentId}/reprocess`,
      )
      .then(unwrap),

  getUsage: (businessId: string): Promise<KnowledgeUsage> =>
    api
      .get<unknown, ApiResponse<KnowledgeUsage>>(
        `/businesses/${businessId}/knowledge/usage`,
      )
      .then(unwrap),

  getPreviewUrl: (
    businessId: string,
    agentId: string,
    documentId: string,
  ): Promise<{ url: string; fileName: string; fileType: string; content: string | null }> =>
    api
      .get<
        unknown,
        ApiResponse<{ url: string; fileName: string; fileType: string; content: string | null }>
      >(`/businesses/${businessId}/agents/${agentId}/knowledge/documents/${documentId}/preview-url`)
      .then(unwrap),
};
