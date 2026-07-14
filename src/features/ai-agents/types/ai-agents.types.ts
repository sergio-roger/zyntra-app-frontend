export type AgentTool =
  'web_search' | 'knowledge_base' | 'lead_capture' | 'calendar';

export interface AiAgent {
  businessId: string;
  createdAt: string;
  id: string;
  isActive: boolean;
  model: string;
  name: string;
  systemPrompt: string;
  temperature: number;
  tools: AgentTool[];
  updatedAt: string;
}

export interface CreateAgentPayload {
  is_active?: boolean;
  model?: string;
  name: string;
  system_prompt: string;
  temperature?: number;
  tools?: AgentTool[];
}

export type UpdateAgentPayload = Partial<CreateAgentPayload>;

export interface AgentTestResult {
  model: string;
  reply: string;
  tokens?: number;
}
