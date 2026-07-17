export enum AgentTool {
  WEB_SEARCH = 'web_search',
  KNOWLEDGE_BASE = 'knowledge_base',
  LEAD_CAPTURE = 'lead_capture',
  CALENDAR = 'calendar',
}

export enum ChatbotTone {
  FORMAL = 'formal',
  CASUAL = 'casual',
  FRIENDLY = 'friendly',
  PROFESSIONAL = 'professional',
  ENTHUSIASTIC = 'enthusiastic',
}

export enum ChatbotLocale {
  ES = 'es',
  EN = 'en',
  PT = 'pt',
}

export enum KnowledgeDocumentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  READY = 'ready',
  FAILED = 'failed',
}

export interface Agent {
  id: string;
  businessId: string;
  name: string;
  model: string;
  systemPrompt: string;
  temperature: number;
  tools: AgentTool[];
  isActive: boolean;
  tone: ChatbotTone | null;
  locale: ChatbotLocale | null;
  maxTokens: number;
  knowledgeCollection: string | null;
  voiceConfig: Record<string, unknown> | null;
  memoryConfig: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgentPayload {
  name: string;
  model?: string;
  systemPrompt: string;
  temperature?: number;
  tools?: AgentTool[];
  isActive?: boolean;
  tone?: ChatbotTone;
  locale?: ChatbotLocale;
  maxTokens?: number;
  voiceConfig?: Record<string, unknown>;
  memoryConfig?: Record<string, unknown>;
}

export type UpdateAgentPayload = Partial<CreateAgentPayload>;

export interface AgentTestSource {
  documentId: string;
  fileName: string;
  snippet?: string;
  score?: number;
}

export interface AgentTestResult {
  reply: string;
  model: string;
  tokens?: number;
  sources?: AgentTestSource[];
}

export interface KnowledgeDocument {
  id: string;
  businessId: string;
  agentId: string;
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
  status: KnowledgeDocumentStatus;
  errorMessage: string | null;
  chunkCount: number;
  tokenCount: number;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
  processedAt: string | null;
}

export interface KnowledgeUsage {
  documentsUsed: number;
  storageUsedMb: number;
  uploadsThisMonth: number;
  limits: {
    kbMaxDocumentsPerAgent: number;
    kbMaxFileSizeMb: number;
    kbMaxStorageMbPerBusiness: number;
    kbMonthlyUploadLimit: number;
  };
}
