export type AgentTool = 'web_search' | 'knowledge_base' | 'lead_capture' | 'calendar';

export interface AiAgent {
  id: string;
  business_id: string;
  name: string;
  model: string;
  system_prompt: string;
  temperature: number;
  tools: AgentTool[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAgentPayload {
  name: string;
  model?: string;
  system_prompt: string;
  temperature?: number;
  tools?: AgentTool[];
  is_active?: boolean;
}

export type UpdateAgentPayload = Partial<CreateAgentPayload>;

export interface AgentTestResult {
  reply: string;
  model: string;
  tokens?: number;
}
