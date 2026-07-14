export interface WebChannelDaySchedule {
  day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
  enabled: boolean;
  from: string;
  to: string;
}

export interface WebChannelBusinessHours {
  is24x7: boolean;
  schedule: WebChannelDaySchedule[];
  timezone: string;
}

export interface WebChannelConfig {
  allowedDomains: string[];
  allowInsecureDomains: boolean;
  assistantName?: string;
  availabilityMode?: 'manual' | 'schedule';
  blockedDomains: string[];
  businessHours?: WebChannelBusinessHours;
  greeting?: string;
  manualStatus?: 'available' | 'busy' | 'offline';
  position: 'bottom-left' | 'bottom-right';
  primaryColor: string;
  theme: 'light' | 'dark' | 'auto';
}

export interface ChannelType {
  configSchema: Record<string, unknown>;
  description: string | null;
  iconUrl: string | null;
  id: string;
  isAvailable: boolean;
  key: string;
  label: string;
  sortOrder: number;
}

export interface Channel {
  agentId: string | null;
  businessId: string;
  channelType: ChannelType;
  channelTypeId: string;
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
