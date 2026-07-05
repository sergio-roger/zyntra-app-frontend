export interface WebChannelConfig {
  greeting?: string;
  assistantName?: string;
  primaryColor: string;
  position: 'bottom-left' | 'bottom-right';
  theme: 'light' | 'dark' | 'auto';
  allowedDomains: string[];
}

export interface ChannelType {
  config_schema: Record<string, unknown>;
  description: string | null;
  icon_url: string | null;
  id: string;
  is_available: boolean;
  key: string;
  label: string;
  sort_order: number;
}

export interface Channel {
  agent_id: string | null;
  business_id: string;
  channel_type_id: string;
  channelType: ChannelType;
  config: Record<string, unknown>;
  created_at: string;
  embedCode?: string;
  id: string;
  name: string;
  status: 'active' | 'inactive';
  updated_at: string;
}

export interface CreateChannelPayload {
  channelTypeId: string;
  config?: Record<string, unknown>;
  name: string;
}

export interface UpdateChannelPayload {
  config?: Record<string, unknown>;
  name?: string;
  status?: 'active' | 'inactive';
}

export interface EmbedSnippetResponse {
  business_id: string;
  channel_id: string;
  snippet: string;
}
