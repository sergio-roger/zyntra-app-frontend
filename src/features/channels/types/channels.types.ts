export interface ChannelType {
  id: string;
  key: string;
  label: string;
  description: string | null;
  icon_url: string | null;
  is_available: boolean;
  config_schema: Record<string, unknown>;
  sort_order: number;
}

export interface Channel {
  id: string;
  business_id: string;
  channel_type_id: string;
  channelType: ChannelType;
  name: string;
  status: 'active' | 'inactive';
  agent_id: string | null;
  config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  embedCode?: string;
}

export interface CreateChannelPayload {
  channelTypeId: string;
  name: string;
  config?: Record<string, unknown>;
}

export interface UpdateChannelPayload {
  name?: string;
  status?: 'active' | 'inactive';
  config?: Record<string, unknown>;
}
