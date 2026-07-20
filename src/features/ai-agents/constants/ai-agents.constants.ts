import { AgentTool } from '@features/ai-agents/types/ai-agents.types';

export const AGENT_TOOL_LABELS: Record<AgentTool, string> = {
  web_search: 'Búsqueda web',
  knowledge_base: 'Base de conocimiento',
  lead_capture: 'Captura de leads',
  calendar: 'Calendario',
};
