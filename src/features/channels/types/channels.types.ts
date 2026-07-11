export interface WebChannelDaySchedule {
  day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
  enabled: boolean;
  from: string;
  to: string;
}

export interface WebChannelBusinessHours {
  timezone: string;
  is24x7: boolean;
  schedule: WebChannelDaySchedule[];
}

export interface WebChannelConfig {
  greeting?: string;
  assistantName?: string;
  primaryColor: string;
  position: 'bottom-left' | 'bottom-right';
  theme: 'light' | 'dark' | 'auto';
  availabilityMode?: 'manual' | 'schedule';
  manualStatus?: 'available' | 'busy' | 'offline';
  businessHours?: WebChannelBusinessHours;
  allowedDomains: string[];
  blockedDomains: string[];
  allowInsecureDomains: boolean;
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
  agentId: string | null;
  businessId: string;
  channelTypeId: string;
  channelType: ChannelType;
  config: Record<string, unknown>;
  createdAt: string;
  embedCode?: string;
  id: string;
  name: string;
  status: 'active' | 'inactive';
  updatedAt: string;
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
