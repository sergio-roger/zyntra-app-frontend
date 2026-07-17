import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@features/auth/store/authStore';
import { toastManager } from '@shared/components/toast/toastManager';
import { getApiErrorMessage } from '@shared/constants/apiErrors';
import { knowledgeApi } from '../api/knowledge.api';
import { KnowledgeDocumentStatus } from '../types/automations';

const DOCUMENTS_QUERY_KEY = (businessId: string, agentId: string) => [
  'automations-knowledge-documents',
  businessId,
  agentId,
];
const USAGE_QUERY_KEY = (businessId: string) => ['automations-knowledge-usage', businessId];

const PENDING_STATUSES: string[] = [
  KnowledgeDocumentStatus.PENDING,
  KnowledgeDocumentStatus.PROCESSING,
];

export function useAgentKnowledgeDocuments(agentId: string | undefined) {
  const businessId = useAuthStore((s) => s.user?.businessId);

  return useQuery({
    queryKey: DOCUMENTS_QUERY_KEY(businessId ?? '', agentId ?? ''),
    queryFn: () => knowledgeApi.list(businessId!, agentId!),
    enabled: !!businessId && !!agentId,
    refetchInterval: (query) => {
      const hasPending = query.state.data?.some((d) =>
        PENDING_STATUSES.includes(d.status),
      );
      return hasPending ? 3000 : false;
    },
  });
}

export function useKnowledgeUsage() {
  const businessId = useAuthStore((s) => s.user?.businessId);

  return useQuery({
    queryKey: USAGE_QUERY_KEY(businessId ?? ''),
    queryFn: () => knowledgeApi.getUsage(businessId!),
    enabled: !!businessId,
  });
}

export function useUploadKnowledgeDocument(agentId: string) {
  const businessId = useAuthStore((s) => s.user?.businessId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => knowledgeApi.upload(businessId!, agentId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: DOCUMENTS_QUERY_KEY(businessId ?? '', agentId),
      });
      queryClient.invalidateQueries({ queryKey: USAGE_QUERY_KEY(businessId ?? '') });
      toastManager.add({
        title: 'Documento subido',
        description: 'Se está procesando, va a pasar a "listo" automáticamente.',
        type: 'success',
      });
    },
    onError: (error) => {
      toastManager.add({
        title: 'No se pudo subir el documento',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
}

export function useRemoveKnowledgeDocument(agentId: string) {
  const businessId = useAuthStore((s) => s.user?.businessId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) =>
      knowledgeApi.remove(businessId!, agentId, documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: DOCUMENTS_QUERY_KEY(businessId ?? '', agentId),
      });
      queryClient.invalidateQueries({ queryKey: USAGE_QUERY_KEY(businessId ?? '') });
      toastManager.add({
        title: 'Documento eliminado',
        description: 'El documento se eliminó correctamente.',
        type: 'success',
      });
    },
    onError: (error) => {
      toastManager.add({
        title: 'No se pudo eliminar el documento',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
}

export function useKnowledgeDocumentPreview(agentId: string) {
  const businessId = useAuthStore((s) => s.user?.businessId);

  return useMutation({
    mutationFn: (documentId: string) =>
      knowledgeApi.getPreviewUrl(businessId!, agentId, documentId),
    onError: (error) => {
      toastManager.add({
        title: 'No se pudo abrir la previsualización',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
}

export function useReprocessKnowledgeDocument(agentId: string) {
  const businessId = useAuthStore((s) => s.user?.businessId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string) =>
      knowledgeApi.reprocess(businessId!, agentId, documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: DOCUMENTS_QUERY_KEY(businessId ?? '', agentId),
      });
      toastManager.add({
        title: 'Reprocesamiento encolado',
        description: 'El documento se va a volver a procesar.',
        type: 'success',
      });
    },
    onError: (error) => {
      toastManager.add({
        title: 'No se pudo reprocesar el documento',
        description: getApiErrorMessage(error),
        type: 'error',
      });
    },
  });
}
